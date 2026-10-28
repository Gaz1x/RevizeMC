import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Input,
  Image,
  Checkbox,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import buyingLogo from "./images/token.png";

const TOKEN_OPTIONS = [
  1000, 2000, 3000, 4000, 5000, 10000, 20000, 30000, 40000, 50000, 100000,
  200000, 300000, 400000, 500000,
];

/*
 * Формат промокода: латиница ЗАГЛАВНЫМИ и цифры, от 4 до 32.
 *
 * Регистр в поле не сохраняется: ввод нормализуется в заглавные
 * (handlePromoChange), поэтому строчных букв тут по определению
 * не бывает. Бэк при этом терпим к регистру — исторические
 * строчные записи в БД находятся через ci-коллацию MySQL.
 *
 * Подчёркивания тут нет, в отличие от ника — сокопируешь шаблон
 * ника, и в поле залетит some_code, который фронт пропустит,
 * а бэк отвергнет.
 */
const PROMO_PATTERN = /^[A-Z0-9]{4,32}$/;

/*
 * Потолок длины для фильтра ввода — чтобы в поле нельзя было
 * вбить строку любой длины.
 */
const PROMO_MAX_LENGTH = 32;

/*
 * Единая задержка отложенных проверок полей (ник и промокод).
 * Пока человек печатает — запрос не уходит, пинг случается
 * только через секунду после последней правки в поле.
 */
const CHECK_DELAY = 1000;

/*
 * Исход проверки промокода.
 *
 * alreadyUsed — игрок уже применял этот же код (таблица uses).
 * notOwned — код типа LINK, но выдан другому игроку.
 * Оба — отдельные флаги, а не invalid: код настоящий, скидка на него
 * есть, просто этому игроку он недоступен. Смешивать с «неверный
 * ввод» нельзя — иначе нельзя отличить опечатку от чужого кода.
 */
type PromoCheck =
  | {
      status: "valid";
      discount: number | null;
      alreadyUsed: boolean;
      notOwned: boolean;
    }
  | { status: "invalid" }
  | { status: "unavailable" };

/*
 * Ключ подтверждённой проверки промокода: код вместе с ником,
 * с которым проверяли.
 *
 * Применимость кода зависит от ника (повторное применение —
 * таблица uses, LINK-код — владелец), поэтому одного кода
 * недостаточно: после смены ника прежнее подтверждение
 * устаревает и проверка должна запуститься заново.
 *
 * Ник приводится к нижнему регистру — сервер не различает
 * регистр ника, и пара Notch/notch обязана считаться одной.
 */
function promoConfirmationKey(code: string, username: string) {
  return `${username.trim().toLowerCase()}|${code}`;
}

export const TokenBlock = () => {
  const [tokens, setTokens] = useState<number>(1000);

  const [smoothValue, setSmoothValue] = useState<number>(
    TOKEN_OPTIONS.indexOf(1000),
  );
  const [isDragging, setIsDragging] = useState(false);

  const [documentsAccepted, setDocumentsAccepted] = useState(false);

  const [username, setUsername] = useState("");
  const [promocode, setPromo] = useState("");

  const [discount, setDiscount] = useState<number | null>(null);
  const [checkedPromo, setCheckedPromo] = useState("");

  /*
   * Таймер отложенной проверки промокода.
   * Хранится в ref, чтобы не пересоздавался при каждом рендере.
   */
  const promoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * Номер последнего запрошенной проверки кода.
   * Ответ на устаревший запрос отбрасывается — иначе при быстрой
   * вводке поздний ответ перезаписал бы результат более позднего.
   */
  const promoRequestRef = useRef(0);

  /*
   * То же самое для отложенной проверки ника: механизм
   * идентичен промокоду — таймер плюс счётчик устаревших ответов.
   */
  const usernameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const usernameRequestRef = useRef(0);

  const [isProcessing, setIsProcessing] = useState(false);

  const [submitErrors, setSubmitErrors] = useState({
    username: false,
    promocode: false,
    documents: false,
  });

  const [isFlashing, setIsFlashing] = useState(false);

  /*
   * Отложенная проверка не должна пережить размонтирование компонента.
   */
  useEffect(() => {
    return () => {
      if (promoTimerRef.current !== null) {
        clearTimeout(promoTimerRef.current);
      }

      if (usernameTimerRef.current !== null) {
        clearTimeout(usernameTimerRef.current);
      }
    };
  }, []);

  const isDesktop = useBreakpointValue({ base: false, xl: true });

  const rubles = Math.max(0, tokens / 10);

  const discountedRubles = discount
    ? Math.round((rubles * (100 - discount)) / 100)
    : rubles;

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    /*
     * Ошибка ника НЕ снимается по факту ввода: любая правка не делает
     * ник правильным — подтверждает только сервер (scheduleUsernameCheck,
     * runUsernameCheck). Раньше первая же клавиша гасила красный, а через
     * секунду поле снова краснело — получалось красно-зелёное мигание.
     * Теперь подсветка меняется только когда ввод отменён (очистка
     * поля) либо когда сервер подтвердил игрока.
     */
    const value = e.target.value;
    const isValid = /^[a-zA-Z0-9_]*$/.test(value);

    if (isValid && value.length <= 16) {
      setUsername(value);

      /*
       * Ник проверяется на существование прямо при вводе —
       * той же отложенной схемой, что промокод.
       */
      scheduleUsernameCheck(value);

      /*
       * Применимость промокода зависит от ника (uses, LINK-владелец) —
       * при каждом изменении ника перепроверяется уже введённый код.
       * Пустой промокод в schedulePromoCheck ничего не сделает,
       * кроме снятия и так снятой ошибки.
       */
      schedulePromoCheck(promocode, value);
    }
  };

  /*
   * Проверяет промокод на сервере.
   *
   * username передаётся не всегда: он нужен, чтобы узнать, не применял
   * ли уже этот игрок этот код и не выдан ли LINK-код кому-то другому.
   * Когда ника ещё нет, сервер просто вернёт alreadyUsed: false
   * и notOwned: false.
   *
   * Три исхода вместо двух: «проверить не удалось» (обрыв сети,
   * превышен rate-limit) — это не то же самое, что неверный код,
   * иначе пользователь увидел бы ошибку ввода из-за сети.
   */
  const checkPromocode = async (
    code: string,
    username?: string,
  ): Promise<PromoCheck> => {
    try {
      const res = await fetch("https://api.revizemc.net/promocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promocode: code, username }),
      });

      if (!res.ok) return { status: "unavailable" };

      const data = await res.json();

      if (!data.valid) return { status: "invalid" };

      const value = Number(data.discount);

      return {
        status: "valid",
        discount:
          Number.isFinite(value) && value >= 0 && value <= 100
            ? value
            : null,
        alreadyUsed: data.alreadyUsed === true,
        notOwned: data.notOwned === true,
      };
    } catch (error) {
      console.error("Ошибка проверки промокода:", error);
      return { status: "unavailable" };
    }
  };

  /*
   * Запускает проверку и применяет результат к состоянию.
   *
   * Ответ отбрасывается, если к его приходу поле уже изменилось:
   * иначе результат устаревшего запроса перекрыл бы свежий.
   *
   * Код проверяется ВМЕСТЕ с ником: и повторное применение (uses),
   * и принадлежность LINK-кода относятся к конкретному игроку.
   * Без ника либо с чужим/уже потраченным кодом скидка
   * не считается — поле помечается как ошибочное.
   */
  const runPromoCheck = async (
    code: string,
    username: string,
    requestNumber: number,
  ) => {
    /*
     * Ник пуст — проверять не на кого: сервер не отличит
     * вашего игрока от чужого.
     */
    if (username.trim() === "") {
      setDiscount(null);
      setCheckedPromo("");
      setSubmitErrors((prev) => ({ ...prev, promocode: true }));
      return;
    }

    const result = await checkPromocode(code, username);

    if (requestNumber !== promoRequestRef.current) return;

    if (result.status === "invalid") {
      setDiscount(null);
      setCheckedPromo("");
      setSubmitErrors((prev) => ({ ...prev, promocode: true }));
      return;
    }

    if (result.status === "unavailable") return;

    /*
     * Сужение типа даёт доступ к флагам: код настоящий, но этому
     * игроку он недоступен — уже тратился (uses) либо выдан
     * другому (LINK через servervariables_players).
     */
    if (result.alreadyUsed || result.notOwned) {
      setDiscount(null);
      setCheckedPromo("");
      setSubmitErrors((prev) => ({ ...prev, promocode: true }));
      return;
    }

    setDiscount(result.discount);
    setCheckedPromo(promoConfirmationKey(code, username));
    setSubmitErrors((prev) => ({ ...prev, promocode: false }));
  };

  /*
   * Подсвечивает поле промокода как ошибочное, если формат не подошёл.
   *
   * Проверка чисто локальная и мгновенная: сервер отверг бы такой код
   * точно так же, но заставлять ждать ответа, чтобы сказать
   * «в двух символах смысла нет», незачем.
   */
  const markPromoFormatError = (code: string) => {
    setSubmitErrors((prev) => ({
      ...prev,
      promocode: !PROMO_PATTERN.test(code),
    }));
  };

  /*
   * Ставит проверку в очередь на секунду вперёд.
   *
   * Пока в поле продолжают печатать, таймер каждый раз сбрасывается,
   * и запрос уходит лишь через PROMO_CHECK_DELAY после последней
   * правки — по одному пингу на паузу в вводе, а не на каждую клавишу.
   */
  const schedulePromoCheck = (code: string, username: string) => {
    if (promoTimerRef.current !== null) {
      clearTimeout(promoTimerRef.current);
      promoTimerRef.current = null;
    }

    const requestNumber = ++promoRequestRef.current;

    /*
     * Пусто — ввод отменён: любая ошибка поля снимается,
     * как будто кода и не было.
     */
    if (code === "") {
      setSubmitErrors((prev) => ({ ...prev, promocode: false }));
      return;
    }

    /*
     * Меньше четырёх символов либо недопустимые символы — ошибка ввода.
     * Показываем её прямо сейчас, не дожидаясь ни таймера, ни ответа.
     */
    if (!PROMO_PATTERN.test(code)) {
      markPromoFormatError(code);
      return;
    }

    /*
     * Ник ещё не введён — сервер не сможет проверить код «на этого
     * игрока»: и uses, и LINK-принадлежность относятся к игроку.
     * Скидку не считаем, поле помечаем сразу — без ника промокод
     * неприменим. Когда ник появится, handleUsernameChange
     * перепроверит уже введённый код.
     */
    if (username.trim() === "") {
      setDiscount(null);
      setCheckedPromo("");
      setSubmitErrors((prev) => ({ ...prev, promocode: true }));
      return;
    }

    /*
     * Формат в порядке и ник есть — дальше код может быть настоящим,
     * и это уже вопрос к серверу, а не к регулярке. Цвет поля при
     * этом не трогаем: вердикт выносит runPromoCheck, а до него поле
     * сохраняет прежнюю подсветку — без мигания на каждый символ.
     */
    promoTimerRef.current = setTimeout(() => {
      promoTimerRef.current = null;
      void runPromoCheck(code, username, requestNumber);
    }, CHECK_DELAY);
  };

  const handlePromoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    /*
     * Регистр не сохраняется: с caps или без — буквы всегда
     * заглавные. Нормализуется само значение, а не только вид:
     * состояние, проверки и то, что уйдёт на сервер, — везде
     * заглавные.
     */
    const value = e.target.value.trim().toUpperCase();

    /*
     * В поле попадает только то, что целиком укладывается в формат:
     * латиница ЗАГЛАВНЫМИ и цифры, не длиннее PROMO_MAX_LENGTH.
     *
     * Недопустимый символ отбрасывается целиком, а не вычищается
     * из строки: значение остаётся прежним — ровно как у ника.
     * Печатать «не туда» бессмысленно, поле просто не меняется.
     *
     * Короткий ввод НЕ блокируется: без 1-3 символов не добраться
     * до 4. Длина проверяется отдельно, в schedulePromoCheck.
     */
    if (
      !/^[A-Z0-9]*$/.test(value) ||
      value.length > PROMO_MAX_LENGTH
    ) {
      return;
    }

    /*
     * Ошибка промокода НЕ снимается по факту ввода — иначе красное
     * поле позеленело бы на первой же клавише новой попытки и снова
     * покраснело через секунду, если код всё ещё неверный. Снимается
     * либо при очистке поля (ввод отменён), либо когда сервер
     * подтвердил код в паре с ником (runPromoCheck).
     */
    setPromo(value);

    /*
     * Поле меняется — старая скидка больше не действует,
     * а прежний код не считается подтверждённым для нового значения.
     */
    setDiscount(null);
    setCheckedPromo("");

    schedulePromoCheck(value, username);
  };

  /*
   * Уход с поля: незавершённую отложенную проверку не ждём,
   * запускаем сразу — пользователь уже закончил вводить.
   */
  const handlePromoBlur = () => {
    const code = promocode.trim();

    if (promoTimerRef.current !== null) {
      clearTimeout(promoTimerRef.current);
      promoTimerRef.current = null;
    }

    if (code === "") return;

    /*
     * Ушёл с поля, так и не дописав код — ошибка не гаснет
     * при потере фокуса, поле остаётся подсвеченным.
     */
    if (!PROMO_PATTERN.test(code)) {
      markPromoFormatError(code);
      return;
    }

    /*
     * Уже подтверждён для этой пары код+닉 — второй запрос не нужен.
     * После смены ника подтверждение устаревает, и проверка
     * по blur запускается заново.
     */
    if (checkedPromo === promoConfirmationKey(code, username)) return;

    void runPromoCheck(code, username, ++promoRequestRef.current);
  };

  /*
   * Проверяет, существует ли ник.
   *
   * Возвращает true/false по ответу сервера либо null, если проверить
   * не удалось. null — отдельное состояние, которое нельзя путать
   * с «такого ника нет»: 429 подсвечивал поле ника как неверное,
   * хотя сам ник был правильный.
   *
   * На 429 выполняется один повтор с паузой из Retry-After — лимитер
   * сам говорит, сколько ждать, и мы не гадаем.
   *
   * Стойкий отказ возвращает null: заказ без подтверждённого ника
   * создавать нельзя, иначе токены уйдут несуществующему игроку
   * и провалятся уже на этапе выдачи.
   */
  const checkPlayerExists = async (
    name: string,
  ): Promise<boolean | null> => {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const res = await fetch(
          `https://api.revizemc.net/player/${encodeURIComponent(name)}`,
        );

        if (res.status === 429 && attempt === 0) {
          const retryAfter = Number(res.headers.get("Retry-After"));

          const waitMs = Math.min(
            Number.isFinite(retryAfter) && retryAfter > 0
              ? retryAfter * 1000 + 250
              : 1000,
            3000,
          );

          await new Promise((resolve) => setTimeout(resolve, waitMs));
          continue;
        }

        if (!res.ok) return null;

        const data = await res.json();

        return data.exists === true;
      } catch (error) {
        console.error("Ошибка проверки ника:", error);
        return null;
      }
    }

    return null;
  };

  /*
   * Применяет результат проверки ника к полю.
   *
   * false — такого игрока нет, поле краснеет. true — игрок найден.
   * null (обрыв сети, превышен лимит) — без изменений: неудачу
   * нельзя отличить от отсутствия ника, а окончательное слово
   * всё равно за кликом по оплате, где проверка повторяется
   * с ретраем по Retry-After.
   */
  const runUsernameCheck = async (
    name: string,
    requestNumber: number,
  ) => {
    const exists = await checkPlayerExists(name);

    if (requestNumber !== usernameRequestRef.current) return;

    if (exists === null) return;

    setSubmitErrors((prev) => ({ ...prev, username: !exists }));
  };

  /*
   * Ставит проверку ника в очередь — та же схема, что у промокода:
   * таймер сбрасывается на каждую правку, счётчик гасит ответы,
   * пришедшие после следующей правки.
   */
  const scheduleUsernameCheck = (name: string) => {
    if (usernameTimerRef.current !== null) {
      clearTimeout(usernameTimerRef.current);
      usernameTimerRef.current = null;
    }

    const requestNumber = ++usernameRequestRef.current;

    /* Пусто — ввод отменён, подсвечивать нечего. */
    if (name === "") {
      setSubmitErrors((prev) => ({ ...prev, username: false }));
      return;
    }

    /*
     * Короче трёх символов — ошибка ввода: ников из одного-двух
     * символов в Minecraft не бывает. Гадать и нагружать API
     * незачем — подсвечиваем прямо сейчас, без запроса.
     */
    if (name.length < 3) {
      setSubmitErrors((prev) => ({ ...prev, username: true }));
      return;
    }

    /*
     * От трёх символов и дальше ник проверяет сервер. Цвет поля
     * при этом НЕ трогаем: подсветку меняет только вердикт сервера
     * в runUsernameCheck. Поле остаётся красным, пока игрок не
     * подтверждён, — ошибка статична, без мигания на каждый символ.
     */
    usernameTimerRef.current = setTimeout(() => {
      usernameTimerRef.current = null;
      void runUsernameCheck(name, requestNumber);
    }, CHECK_DELAY);
  };

  const handlePayClick = async () => {
    if (isFlashing || isProcessing) return;
    setIsProcessing(true);

    /*
     * Номер этой проверки промокода захватывается ДО первых await
     * и сверяется после каждого из них.
     *
     * Пока ждём ответа сервера, поле промокода могут очистить —
     * и без сверки устаревший ответ покрасил бы уже пустое поле. Побочный эффект бампа —
     * отбрасываются и незавершённые отложенные проверки из ввода:
     * их результат всё равно предварительный, авторитетный —
     * у /create-order.
     */
    const promoRequestNumber = ++promoRequestRef.current;

    /*
     * Незавершённые отложенные проверки ника из ввода гасим:
     * авторитетная проверка происходит здесь, а поздний ответ
     * из ввода мог бы перекрыть её решение по устаревшему
     * значению поля.
     */
    if (usernameTimerRef.current !== null) {
      clearTimeout(usernameTimerRef.current);
      usernameTimerRef.current = null;
    }

    usernameRequestRef.current += 1;

    const isUsernameLocalError = username.length < 3;

    const promoValue = promocode.trim();
    const isPromoLocalError =
      promoValue !== "" && !PROMO_PATTERN.test(promoValue);
    const isDocumentsError = !documentsAccepted;

    let isUsernameServerError = false;
    let isPromoServerError = false;

    if (!isUsernameLocalError) {
      /*
       * false — игрока нет, null — проверить не удалось.
       * Оба блокируют заказ: без подтверждённого ника токены
       * уйдут несуществующему игроку.
       */
      const playerExists = await checkPlayerExists(username);

      if (playerExists !== true) {
        isUsernameServerError = true;
      }
    }

    if (!isPromoLocalError && promoValue !== "") {
      /*
       * Отложенная проверка из ввода ещё могла не отработать —
       * гасим, чтобы после отправки формы она не прилетела
       * и не перекрыла состояние уже вторым запросом.
       */
      if (promoTimerRef.current !== null) {
        clearTimeout(promoTimerRef.current);
        promoTimerRef.current = null;
      }

      /*
       * Проверяем заново и обязательно с никнеймом: «применял ли
       * этот игрок этот код» от ника зависит, поэтому закэшированного
       * результата ввода (checkedPromo) недостаточно — игрок мог
       * вписать промокод раньше, чем ник.
       *
       * Один лишний запрос на клик по оплате — приемлемая цена
       * за то, что скидка не уйдёт чужому или повторно.
       */
      if (isUsernameLocalError) {
        /*
         * Ника нет или он сам по себе невалиден — проверять код
         * «на этого игрока» не на кого. Скидка не считается,
         * поле промокода помечается как ошибочное.
         */
        isPromoServerError = true;
      } else {
        const result = await checkPromocode(promoValue, username);

        /*
         * Поле изменилось, пока ждали ответа — результат отбрасываем
         * целиком: он относится к значению, которого в поле уже нет.
         * Финальное слово всё равно за /create-order, он проверит
         * промокод заново по уже отправленным данным.
         */
        if (promoRequestNumber === promoRequestRef.current) {
          if (result.status === "invalid") {
            isPromoServerError = true;
          } else if (result.status === "valid") {
            if (result.alreadyUsed || result.notOwned) {
              /*
               * Код настоящий, скидка на него есть, но этому игроку
               * он недоступен: уже тратился (uses) либо выдан другому
               * (LINK через servervariables_players). Подсвечиваем поле
               * и не пускаем оплату.
               */
              isPromoServerError = true;
            } else {
              setDiscount(result.discount);
              setCheckedPromo(
                promoConfirmationKey(promoValue, username),
              );
            }
            /*
             * status === "unavailable" — проверить не удалось.
             * Оплату не блокируем: промокод опционален, а финальное
             * слово всё равно за /create-order на сервере.
             */
          }
        }
      }
    }

    const finalPromoError = isPromoLocalError || isPromoServerError;
    const finalUsernameError = isUsernameLocalError || isUsernameServerError;

    if (finalUsernameError || finalPromoError || isDocumentsError) {
      /*
       * Ошибки остаются гореть, пока соответствующие поля не
       * исправят — каждое поле снимает свою ошибку своим onChange.
       * Сбрасывать их таймером нельзя: поле позеленеет, хотя
       * проблема никуда не делась. Мигание подсветки — только
       * визуальный акцент, оно само гаснет.
       */
      setSubmitErrors({
        username: finalUsernameError,
        promocode: finalPromoError,
        documents: isDocumentsError,
      });

      setIsFlashing(true);

      setTimeout(() => {
        setIsFlashing(false);
      }, 600);

      setIsProcessing(false);
      return;
    }

    try {
      const purchaseRes = await fetch("https://api.revizemc.net/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          tokens: Number(tokens),
          promocode: promocode.trim(),
        }),
      });

      const purchaseData = await purchaseRes.json();

      if (purchaseRes.ok && purchaseData.paymentUrl) {
        console.log("Оплата успешно инициирована");

        setUsername("");
        setPromo("");
        setDiscount(null);
        setCheckedPromo("");
        setDocumentsAccepted(false);
        setTokens(1000);
        setSmoothValue(TOKEN_OPTIONS.indexOf(1000));

        window.location.href = purchaseData.paymentUrl;
      } else {
        console.error(purchaseData);

        /*
         * Отказ, относящийся к промокоду, подсвечивает поле промокода.
         *
         * Раньше любая ошибка /create-order красила поле ника, хотя
         * поле ника здесь ни при чём — человек искал бы ошибку в нике,
         * тогда как проблема в чужом LINK-коде.
         *
         * Ошибка приходит именно сюда, а не только из предварительной
         * проверки: код мог стать чужим между двумя запросами, а прямой
         * вызов API проверку на фронте минует вовсе.
         */
        const isPromoFailure =
          purchaseData?.code === "PROMO_NOT_OWNED" ||
          purchaseData?.code === "PROMO_INVALID";

        setSubmitErrors({
          username: !isPromoFailure,
          promocode: isPromoFailure,
          documents: false,
        });

        setIsFlashing(true);

        setTimeout(() => {
          setIsFlashing(false);
        }, 600);
      }
    } catch (error) {
      console.error("Сбой оплаты:", error);

      /*
       * Сетевой сбой не подтвердил ник — ошибка горит до правки
       * поля, таймером её не гасим.
       */
      setSubmitErrors((prev) => ({ ...prev, username: true }));
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 600);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSliderChange = (val: number) => {
    setSmoothValue(val);
    setTokens(TOKEN_OPTIONS[Math.round(val)]);
  };

  const handleSliderChangeEnd = (val: number) => {
    const snappedIdx = Math.round(val);
    setSmoothValue(snappedIdx);
    setIsDragging(false);
  };

  const handleQuickSelect = (amount: number) => {
    const idx = TOKEN_OPTIONS.indexOf(amount);
    if (idx !== -1) {
      setSmoothValue(idx);
      setTokens(amount);
    }
  };

  const getCheckboxStyles = (hasError: boolean) => ({
    ".chakra-checkbox__control": {
      bg: hasError ? "#592828" : "#285928",
      border: "3px solid",
      borderColor: hasError ? "#FF8080" : "#80ff80",
      borderRadius: "5px",
      transition: "all 0.3s ease-in-out",
      svg: { display: "none" },
      _checked: {
        bg: "#80ff80",
        borderColor: "#80ff80",
        color: "transparent",
      },
      _focus: {
        boxShadow: "none",
      },
      "@media (hover: hover) and (pointer: fine)": {
        "&:hover": {
          borderColor: hasError ? "#FF8080" : "#FFFFFF",
        },
        "&[data-checked]:hover": {
          borderColor: "#80ff80",
          bg: "#80ff80",
        },
        "&:active": {
          bg: "transparent",
        },
      },
    },
  });

  return (
    <VStack
      w="full"
      maxW={{ xl: "800px", base: "370px" }}
      bgGradient="linear(to-t, transparent, rgba(128, 255, 128, 0.15))"
      border="solid #80ff80"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius="25px"
      p={4}
      mt={{ xl: "30px", base: "15px" }}
      spacing={4}
      align="stretch"
      sx={{ WebkitTapHighlightColor: "transparent" }}
    >
      <HStack alignItems="center" p="0px" spacing={3}>
        <Box w={{ xl: "36px", base: "27px" }} h={{ xl: "36px", base: "27px" }}>
          <Image
            src={buyingLogo}
            alt="Токен"
            fit="fill"
            draggable={false}
            userSelect="none"
          />
        </Box>
        <Text
          fontSize={{ base: "xl", xl: "3xl" }}
          fontFamily="heading"
          color="#80ff80"
          lineHeight="1"
        >
          ПОКУПКА ТОКЕНОВ
        </Text>
      </HStack>

      <Flex direction={{ base: "column", xl: "row" }} gap={4} w="full">
        <VStack flex="1" align="flex-start" spacing={3}>
          <Input
            bg={submitErrors.username ? "#592828" : "#285928"}
            color="white"
            placeholder="ПСЕВДОНИМ"
            h="50px"
            borderRadius="15px"
            border="solid"
            borderColor={submitErrors.username ? "#FF8080" : "#80ff80"}
            borderWidth={{ xl: "6px", base: "4px" }}
            fontSize="lg"
            w="full"
            transition="all 0.3s ease-in-out"
            value={username}
            onChange={handleUsernameChange}
            _placeholder={{
              color: submitErrors.username ? "#FF8080" : "#80ff80",
              transition: "color 0.3s ease-in-out",
            }}
            _hover={{
              borderColor: submitErrors.username ? "#FF8080" : "#80ff80",
            }}
            _focus={{
              borderColor: "white",
              boxShadow: "none",
            }}
          />
          <Input
            bg={submitErrors.promocode ? "#592828" : "#285928"}
            color="white"
            placeholder="ПРОМОКОД"
            border="solid"
            borderColor={submitErrors.promocode ? "#FF8080" : "#80ff80"}
            borderWidth={{ xl: "6px", base: "4px" }}
            h="50px"
            borderRadius="15px"
            fontSize="lg"
            w="full"
            transition="all 0.3s ease-in-out"
            value={promocode}
            onChange={handlePromoChange}
            onBlur={handlePromoBlur}
            _placeholder={{
              color: submitErrors.promocode ? "#FF8080" : "#80ff80",
              transition: "color 0.3s ease-in-out",
            }}
            _hover={{
              borderColor: submitErrors.promocode ? "#FF8080" : "#80ff80",
            }}
            _focus={{
              borderColor: "white",
              boxShadow: "none",
            }}
          />
        </VStack>

        <VStack flex="1" align="flex-start" spacing={3}>
          <Button
            bg="#80ff80"
            color="#285928"
            h="50px"
            borderRadius="15px"
            border="solid"
            borderColor="#80ff80"
            borderWidth={{ xl: "6px", base: "4px" }}
            fontFamily="heading"
            fontSize="lg"
            w="full"
            transition="all 0.3s ease-out"
            cursor="pointer"
            isLoading={isProcessing}
            onClick={handlePayClick}
            _hover={{
              transform: "scale(0.95)",
            }}
            _active={{
              transform: "scale(0.9)",
            }}
          >
            {discountedRubles.toLocaleString("ru-RU")} рублей
          </Button>

          <VStack
            spacing={{ xl: "5.5px", base: "10px" }}
            alignItems="flex-start"
            w="full"
          >
            <HStack spacing={3}>
              <Flex w="18px" justify="center" align="center">
                <Checkbox
                  id="documents-check"
                  isChecked={documentsAccepted}
                  sx={getCheckboxStyles(submitErrors.documents)}
                  onChange={(e) => {
                    setDocumentsAccepted(e.target.checked);
                    setSubmitErrors((prev) => ({ ...prev, documents: false }));
                  }}
                />
              </Flex>
              <Text
                as="label"
                htmlFor="documents-check"
                color="white"
                fontSize={{ xl: "11px", base: "12.9px" }}
                fontFamily="body"
                cursor="pointer"
              >
                ПРИНИМАЮ УСЛОВИЯ ДОКУМЕНТОВ:
              </Text>
            </HStack>

            <VStack alignItems="flex-start" spacing={2} mt={{xl: "-2px", base: "-7px"}}>
              <HStack spacing={3}>
                <Flex w="18px" justify="center" align="center">
                  <Box
                    display={"none"}
                    w="6px"
                    h="6px"
                    borderRadius="1.5px"
                    bgColor={submitErrors.documents ? "#FF8080" : "#80ff80"}
                    transition="all 0.3s ease-in-out"
                  />
                </Flex>
                <Text
                  as="span"
                  bgColor={submitErrors.documents ? "#FF8080" : "#80ff80"}
                  bgClip="text"
                  fontSize={{ xl: "11.4px", base: "13.35px" }}
                  fontFamily="body"
                  lineHeight="1"
                  transition="all 0.3s ease-out"
                  textAlign="justify"
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      "https://www.revizemc.net/terms-of-service.pdf",
                      "_blank",
                    );
                  }}
                  sx={{
                    "@media (hover: hover) and (pointer: fine)": {
                      "&:hover": { bgColor: "#FFFFFF" },
                    },
                  }}
                >
                  ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ
                </Text>
              </HStack>

              <HStack spacing={3}>
                <Flex w="18px" justify="center" align="center">
                  <Box
                    display={"none"}
                    w="6px"
                    h="6px"
                    borderRadius="1.5px"
                    bgColor={submitErrors.documents ? "#FF8080" : "#80ff80"}
                    transition="all 0.3s ease-in-out"
                  />
                </Flex>
                <Text
                  as="span"
                  bgColor={submitErrors.documents ? "#FF8080" : "#80ff80"}
                  bgClip="text"
                  fontSize={{ xl: "11.2px", base: "13.05px" }}
                  fontFamily="body"
                  lineHeight="1"
                  textAlign="justify"
                  transition="all 0.3s ease-out"
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      "https://www.revizemc.net/privacy-policy.pdf",
                      "_blank",
                    );
                  }}
                  sx={{
                    "@media (hover: hover) and (pointer: fine)": {
                      "&:hover": { bgColor: "#FFFFFF" },
                    },
                  }}
                >
                  ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </Flex>

      <Flex direction="column" w="full" mt="-5px">
        <Box
          order={{ base: 2, xl: 1 }}
          w="full"
          h={{ xl: "50px", base: "35px" }}
          border="solid #80ff80"
          borderWidth={{ xl: "6px", base: "4px" }}
          borderRadius={{ base: "10px", xl: "15px" }}
          bg="transparent"
          px={{ base: "14px", xl: "20px" }}
          display="flex"
          alignItems="center"
          overflow="hidden"
          bgColor="#285928"
        >
          <Slider
            aria-label="token-slider"
            value={smoothValue}
            min={0}
            max={TOKEN_OPTIONS.length - 1}
            step={0.01}
            focusThumbOnChange={false}
            w="full"
            role="group"
            onChange={handleSliderChange}
            onChangeStart={() => setIsDragging(true)}
            onChangeEnd={handleSliderChangeEnd}
            sx={{
              WebkitTapHighlightColor: "transparent !important",
              WebkitUserSelect: "none !important",
              userSelect: "none !important",
              outline: "none !important",
              boxShadow: "none !important",
              ".chakra-slider__track": {
                overflow: "visible !important",
                bg: "transparent !important",
              },
            }}
          >
            <SliderTrack bg="transparent" h={{ base: "8px", xl: "12px" }}>
              <SliderFilledTrack
                ml={{ base: "-5px", xl: "-10px" }}
                bg="white"
                borderLeftRadius="4px"
                borderRightRadius="0px"
                transition={isDragging ? "none" : "width 0.3s ease-out"}
              />
            </SliderTrack>
            <SliderThumb
              w={{ base: "20px", xl: "30px" }}
              h={{ base: "20px", xl: "30px" }}
              bg="transparent"
              border="none"
              outline="none"
              boxShadow="none !important"
              transition={isDragging ? "none" : "left 0.3s ease-out"}
              _focus={{
                boxShadow: "none !important",
                outline: "none !important",
              }}
              _focusVisible={{
                boxShadow: "none !important",
                outline: "none !important",
              }}
              _active={{
                boxShadow: "none !important",
                outline: "none !important",
              }}
              sx={{
                WebkitTapHighlightColor: "transparent !important",
                outline: "none !important",
              }}
            >
              <Box
                w="100%"
                h="100%"
                borderRadius={"5px"}
                bg="#80ff80"
                transition="all 0.3s ease-in-out"
                boxShadow="none !important"
                outline="none !important"
                _groupHover={{
                  bg: "white",
                  transform: "scale(0.85)",
                }}
                _groupActive={{
                  bg: "white",
                  transform: "scale(0.75)",
                }}
              />
            </SliderThumb>
          </Slider>
        </Box>

        <SimpleGrid
          order={{ base: 1, xl: 2 }}
          columns={{ base: 5, xl: 5 }}
          spacing={{ base: 1.5, xl: 2 }}
          mt={{ base: 0, xl: 3 }}
          mb={{ base: 3, xl: 0 }}
          w="full"
        >
          {TOKEN_OPTIONS.map((val) => {
            const isActive = tokens === val;
            const displayVal = isDesktop
              ? `${val / 1000} 000`
              : `${val / 1000}K`;

            return (
              <Button
                key={val}
                bg={isActive ? "#80ff80" : "#285928"}
                color={isActive ? "#285928" : "white"}
                border="solid #80ff80"
                borderWidth={{ xl: "6px", base: "4px" }}
                h={{ xl: "50px", base: "35px" }}
                borderRadius={{ xl: "15px", base: "10px" }}
                fontFamily="heading"
                fontSize={{ xl: "16px", base: "10px" }}
                p={0}
                transition="all 0.3s ease-out"
                onClick={() => handleQuickSelect(val)}
                _hover={{
                  transform: "scale(0.95)",
                  borderColor: !isActive ? "white" : "transparent",
                  color: !isActive ? "white" : "#285928",
                }}
                _active={{
                  transform: "scale(0.9)",
                }}
              >
                <Text lineHeight="1">{displayVal}</Text>
              </Button>
            );
          })}
        </SimpleGrid>
      </Flex>
      <VStack align={{ base: "center", xl: "flex-end"}} mt={-2} mb={-2}>
        <Text
          fontFamily="heading"
          fontSize={{ base: "11px", xl: "13px" }}
          lineHeight="1.5"
          letterSpacing="wide"
          color="white"
        >
          ТОКЕНЫ — ИГРОВАЯ ВАЛЮТА НА СЕРВЕРЕ
        </Text>
      </VStack>
    </VStack>
  );
};