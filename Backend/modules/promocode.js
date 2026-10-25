import { Router } from 'express';
import dbPool from '../lib/db.js';
import {
  PROMOCODE_FORMAT,
  safeUsername
} from '../lib/validators.js';

const promocodeRouter = Router();

/*
 * Ответ по умолчанию: код не подошёл, скидки нет, использований
 * и претензий по принадлежности нет. Возвращается везде, где
 * проверка не дошла до БД.
 */
const invalidResponse = {
  valid: false,
  discount: null,
  alreadyUsed: false,
  notOwned: false
};

/*
 * Проверяет, принадлежит ли LINK-промокод игроку.
 *
 * В revizeapi_promo.codes лежит только тип бонуса, а не владелец.
 * Владелец определяется по revizemc_servervariables.servervariables_players —
 * там одна строка на переменную игрока: NAME — тип переменной,
 * VALUE — её значение, PLAYER_NAME — кому она выдана.
 * Нам нужна строка с типом 'code' и этим промокодом в значении:
 * её PLAYER_NAME и есть владелец.
 *
 * Возвращает true, если код можно применять этому игроку.
 *
 * Политика при неудаче — ЖЁСТКАЯ (в отличие от общего fail-open
 * для промокода): это проверка против выдачи чужого кода, и при
 * сбое она обязана продолжать работать, а не молча отключаться.
 * Ошибки пишутся в лог, чтобы по ним было видно, что проверка
 * не проходит вовсе.
 */
export async function linkCodeBelongsTo(code, username) {
  try {
    const [rows] = await dbPool.query(
      `
      SELECT PLAYER_NAME
      FROM revizemc_servervariables.servervariables_players
      WHERE NAME = 'code'
        AND VALUE = ?
      LIMIT 1
      `,
      [code]
    );

    /*
     * Строки владельца нет: код никем не выдан, а значит —
     * не выдан и этому игроку. Отказываем, иначе свободный
     * LINK-код смог бы активировать кто угодно.
     */
    if (rows.length === 0) {
      console.warn(
        `LINK-промокод "${code}" не найден в servervariables_players`
      );

      return false;
    }

    const owner = String(rows[0].PLAYER_NAME || '');

    /*
     * Сравниваем без учёта регистра: Minecraft не различает
     * регистр ников, и SQL-запросы проекта (players.js) полагаются
     * на регистронезависую коллацию. Здесь же мы сравниваем в JS,
     * поэтому регистр снимаем руками.
     */
    return owner.toLowerCase() === String(username).toLowerCase();
  } catch (error) {
    console.error('Ошибка проверки владельца LINK-промокода:', error);

    return false;
  }
}

/*
 * Проверка промокода по таблице codes.
 *
 * Возвращает valid и discount, чтобы фронт сразу показал размер скидки.
 * Списание remain здесь НЕ происходит — это должно делаться при
 * подтверждении оплаты, иначе неверно введённый код уменьшал бы остаток.
 *
 * Параметр username необязателен: с ним дополнительно проверяется,
 * не применял ли уже этот игрок этот же код (таблица uses) и не выдан
 * ли LINK-код кому-то другому (servervariables_players).
 * Без валидного ника проверить не на кого — alreadyUsed и notOwned
 * остаются false, и покупка не блокируется.
 */
promocodeRouter.post('/', async (req, res) => {
  const { promocode, username } = req.body;

  if (typeof promocode !== 'string') {
    return res.json(invalidResponse);
  }

  const code = promocode.trim();

  if (!PROMOCODE_FORMAT.test(code)) {
    return res.json(invalidResponse);
  }

  const name =
    typeof username === 'string' ? username.trim() : '';

  const checkedName = safeUsername(name) ? name : '';

  try {
    const [rows] = await dbPool.query(
      `
      SELECT
        discount,
        bonus
      FROM revizeapi_promo.codes
      WHERE code = ?
        AND remain > 0
      LIMIT 1
      `,
      [code]
    );

    if (rows.length === 0) {
      return res.json(invalidResponse);
    }

    let alreadyUsed = false;
    let notOwned = false;

    if (checkedName !== '') {
      /*
       * Два разных способа ограничить повторное применение,
       * и какой работает — зависит от типа бонуса.
       *
       * LINK — код привязан к конкретному игроку через
       * servervariables_players, и в uses он никогда не записывается.
       * Обычный код владельца не имеет, его ограничение —
       * ровно одно применение каждым игроком через таблицу uses.
       */
      if (rows[0].bonus === 'LINK') {
        notOwned = !(await linkCodeBelongsTo(code, checkedName));
      } else {
        const [usedRows] = await dbPool.query(
          `
          SELECT 1
          FROM revizeapi_promo.uses
          WHERE username = ?
            AND code = ?
          LIMIT 1
          `,
          [checkedName, code]
        );

        alreadyUsed = usedRows.length > 0;
      }
    }

    return res.json({
      valid: true,
      discount: rows[0].discount,
      alreadyUsed,
      notOwned
    });
  } catch (error) {
    console.error('Ошибка проверки промокода:', error);

    /*
     * Промокод — необязательное поле, поэтому сбой проверки
     * не должен блокировать покупку.
     */
    return res.json(invalidResponse);
  }
});

/*
 * Списывает использование промокода при подтверждённой оплате.
 *
 * Вызывается ВНУТРИ транзакции заказа, на том же соединении:
 * только так два параллельных платежа по одному коду не смогут
 * списать его дважды. Блокировка FOR UPDATE держится до commit.
 *
 * Правила:
 *   remain уменьшается на 1;
 *   bonus = 'LINK' — строка из codes удаляется, в uses ничего не пишется;
 *   иначе — в uses добавляется пара (username, code);
 *   если remain дошёл до 0 — код удаляется из codes, а все записи
 *   в uses по нему вычищаются.
 *
 * Ошибки не глотаются: списание и отметка «заказ оплачен» — одно
 * событие, и они обязаны либо произойти вместе, либо не произойти
 * вовсе. Иначе в базе появился бы оплаченный заказ без списания,
 * и повторная доставка от Robokassa его бы не исправила.
 */
export async function consumePromocode(connection, code, username) {
  if (!code) return;

  const [rows] = await connection.query(
    `
    SELECT
      code,
      bonus,
      remain
    FROM revizeapi_promo.codes
    WHERE code = ?
    FOR UPDATE
    `,
    [code]
  );

  /*
   * Между созданием заказа и оплатой код могли удалить вручную.
   * Деньги получены — токены выдаём, списывать просто нечего.
   */
  if (rows.length === 0) {
    console.warn(`Промокод "${code}" не найден при оплате заказа`);
    return;
  }

  const promo = rows[0];
  const remainAfter = Number(promo.remain) - 1;

  await connection.query(
    `
    UPDATE revizeapi_promo.codes
    SET remain = remain - 1
    WHERE code = ?
    `,
    [code]
  );

  /*
   * Исчерпанный код вычищается целиком: и из codes, и из uses.
   * Вставка в uses здесь не делается — её сразу удалили бы
   * вместе с остальными записями по этому коду.
   */
  if (remainAfter <= 0) {
    await connection.query(
      `
      DELETE FROM revizeapi_promo.codes
      WHERE code = ?
      `,
      [code]
    );

    await connection.query(
      `
      DELETE FROM revizeapi_promo.uses
      WHERE code = ?
      `,
      [code]
    );

    return;
  }

  /*
   * LINK — код, который должен сработать один раз и исчезнуть:
   * строка удаляется сразу после применения, история uses
   * для таких кодов не ведётся.
   */
  if (promo.bonus === 'LINK') {
    await connection.query(
      `
      DELETE FROM revizeapi_promo.codes
      WHERE code = ?
      `,
      [code]
    );

    return;
  }

  await connection.query(
    `
    INSERT INTO revizeapi_promo.uses (username, code)
    VALUES (?, ?)
    `,
    [username, code]
  );
}

export default promocodeRouter;
