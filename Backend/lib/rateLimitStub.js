/*
 * Заглушка express-rate-limit.
 *
 * ВРЕМЕННОЕ РЕШЕНИЕ: пакет express-rate-limit не установлен,
 * из-за чего сервер падал с ERR_MODULE_NOT_FOUND.
 *
 * Повторяет базовое API: rateLimit({ windowMs, max, standardHeaders, legacyHeaders })
 * Считает запросы по IP в памяти процесса (сбрасывается при перезапуске).
 *
 * TODO: заменить на настоящий пакет:
 *   npm i express-rate-limit
 * и вернуть импорт:
 *   import rateLimit from 'express-rate-limit';
 */
export default function rateLimit({
  windowMs = 60_000,
  max = 100,
  standardHeaders = false,
  legacyHeaders = false
} = {}) {
  const hits = new Map();

  const sweeper = setInterval(() => {
    const now = Date.now();

    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) {
        hits.delete(key);
      }
    }
  }, windowMs);

  sweeper.unref?.();

  return (req, res, next) => {
    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();

    let entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;

    const remaining = Math.max(0, max - entry.count);
    const resetSeconds = Math.ceil((entry.resetAt - now) / 1000);

    if (standardHeaders) {
      res.setHeader('RateLimit-Limit', String(max));
      res.setHeader('RateLimit-Remaining', String(remaining));
      res.setHeader('RateLimit-Reset', String(resetSeconds));
    }

    if (legacyHeaders) {
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(remaining));
      res.setHeader('X-RateLimit-Reset', String(resetSeconds));
    }

    if (entry.count > max) {
      res.setHeader('Retry-After', String(resetSeconds));

      return res.status(429).json({
        error: 'Слишком много запросов, попробуйте позже'
      });
    }

    next();
  };
}
