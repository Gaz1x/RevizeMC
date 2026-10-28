export const MIN_TOKENS = 100;
export const MAX_TOKENS = 500000;

/*
 * Формат промокода: латиница обоих регистров и цифры, от 4 до 32 символов.
 *
 * Минимум 4: всё короче фронт отсекает ещё на вводе и на сервер не
 * отправляет, поэтому здесь это страховка на случай прямого вызова API.
 *
 * Максимум 32 — по ширине колонки в revizemc_api.codes. Без него
 * в запрос можно отправить строку любой длины.
 *
 * Границы обязаны совпадать с PROMO_PATTERN в TokenBlock.tsx.
 */
export const PROMOCODE_FORMAT = /^[a-zA-Z0-9]{4,32}$/;

export function safeUsername(value) {
  return typeof value === 'string' &&
    /^[a-zA-Z0-9_]{3,16}$/.test(value);
}

export function safeTokenAmount(value) {
  const amount = Number(value);

  return Number.isInteger(amount) &&
    amount >= MIN_TOKENS &&
    amount <= MAX_TOKENS;
}

export function normalizeAmount(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number.toFixed(2);
}
