import { Router } from 'express';
import dbPool from '../lib/db.js';
import {
  safeUsername,
  safeTokenAmount,
  PROMOCODE_FORMAT,
  MIN_TOKENS,
  MAX_TOKENS
} from '../lib/validators.js';
import { createRobokassaUrl } from './robokassa.js';
import { linkCodeBelongsTo } from './promocode.js';

const ordersRouter = Router();

/*
 * Считает итоговую сумму с учётом скидки в процентах.
 * Скидка приходит из БД, клиенту она не доверяется.
 */
function applyDiscount(amount, discount) {
  if (!discount) return amount;

  return amount * (1 - discount / 100);
}

/*
 * Ищет промокод в БД и возвращает его скидку вместе с типом бонуса.
 * bonus нужен, чтобы понять, привязан ли код к конкретному игроку.
 * null — если код не задан, пустой или не подошёл.
 */
async function findPromo(code) {
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

  if (rows.length === 0) return null;

  return {
    discount: rows[0].discount,
    bonus: rows[0].bonus
  };
}

/*
 * Создание заказа.
 *
 * Этот endpoint НЕ выдаёт токены.
 * Он только создаёт pending-заказ и возвращает ссылку Robokassa.
 *
 * Скидка применяется к сумме заказа здесь, а списание remain
 * происходит позже — в /robokassa/result, когда оплата подтверждена.
 */
ordersRouter.post('/', async (req, res) => {
  const {
    username,
    tokens,
    promocode
  } = req.body;

  if (!safeUsername(username)) {
    return res.status(400).json({
      error: 'Некорректный никнейм'
    });
  }

  if (!safeTokenAmount(tokens)) {
    return res.status(400).json({
      error: `Количество токенов должно быть от ${MIN_TOKENS} до ${MAX_TOKENS}`
    });
  }

  /*
   * Промокод необязателен, но если передан — обязан быть корректным
   * по формату. Это отсекает мусор до обращения к БД.
   */
  const code =
    typeof promocode === 'string' ? promocode.trim() : '';

  if (code !== '' && !PROMOCODE_FORMAT.test(code)) {
    return res.status(400).json({
      error: 'Некорректный промокод',
      code: 'PROMO_INVALID'
    });
  }

  try {
    const tokenAmount = Number(tokens);
    const baseAmount = tokenAmount / 10;

    /*
     * Скидка пересчитывается на сервере по свежей строке из БД.
     * Фронт присылает только код — размер скидки ему не доверяем,
     * иначе сумму можно подделать прямо в консоли браузера.
     */
    let discount = null;

    if (code !== '') {
      const promo = await findPromo(code);

      /*
       * Код есть, но не найден или исчерпан — заказ не создаём.
       * Иначе человек увидит цену со скидкой на кнопке,
       * а спишется полная.
       */
      if (promo === null) {
        return res.status(400).json({
          error: 'Промокод недействителен',
          code: 'PROMO_INVALID'
        });
      }

      /*
       * LINK-код привязан к конкретному игроку.
       *
       * Проверка стоит именно здесь, а не только на фронте: фронт
       * её спокойно обходится прямым вызовом API, а отказ на этом
       * этапе ещё ничего не стоит — заказ не создан, денег не
       * потрачено. Позже отказать уже нельзя: скидка зашита в сумму,
       * и Robokassa спишет утверждённую величину.
       */
      if (promo.bonus === 'LINK') {
        const belongs = await linkCodeBelongsTo(code, username.trim());

        if (!belongs) {
          return res.status(400).json({
            error: 'Этот промокод выдан другому игроку',
            code: 'PROMO_NOT_OWNED'
          });
        }
      }

      discount = promo.discount;
    }

    const amount = applyDiscount(baseAmount, discount);

    const invoiceId = Number(
      `${Date.now()}${Math.floor(Math.random() * 1000)}`
    );

    /*
     * Код кладём в заказ даже при нулевой скидке: на момент оплаты
     * в /robokassa/result именно отсюда берётся, что списать.
     * Пустой ввод превращается в NULL — так в таблице отражено
     * «промокода не было».
     */
    await dbPool.query(
      `
      INSERT INTO revizemc_api.orders
        (
          invoice_id,
          username,
          promocode,
          token_amount,
          amount,
          status
        )
      VALUES
        (?, ?, ?, ?, ?, 'pending')
      `,
      [
        invoiceId,
        username.trim(),
        code !== '' ? code : null,
        tokenAmount,
        amount.toFixed(2)
      ]
    );

    const paymentUrl = createRobokassaUrl({
      invoiceId,
      amount,
      description: `Покупка ${tokenAmount} токенов для ${username.trim()}`
    });

    return res.json({
      success: true,
      invoiceId,
      tokenAmount,
      amount: amount.toFixed(2),
      discount,
      paymentUrl
    });
  } catch (error) {
    console.error('Ошибка создания заказа:', error);

    return res.status(500).json({
      error: 'Не удалось создать заказ'
    });
  }
});

export default ordersRouter;
