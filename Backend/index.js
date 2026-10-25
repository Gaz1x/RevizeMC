import './lib/env.js';
import express from 'express';
import cors from 'cors';
import rateLimit from './lib/rateLimitStub.js';

import cacheRouter from './modules/cache.js';
import playersRouter from './modules/players.js';
import promocodeRouter from './modules/promocode.js';
import ordersRouter from './modules/orders.js';
import {
  robokassaRouter,
  deliveryRouter
} from './modules/robokassa.js';

const PORT = Number(process.env.PORT || 3000);

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: 'https://www.revizemc.net'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
 * ---------------------------------------------------------------------------
 * Ограничение частоты запросов
 * ---------------------------------------------------------------------------
 *
 * У всех трёх лимитеров одинаковое окно в 10 секунд — так предсказуемо
 * считается худший простой: заглушка rate-limit держит фиксированное
 * окно от первого запроса, поэтому длинное окно могло бы заблокировать
 * пользователя почти на минуту.
 *
 * ВАЖНО: роуты кэша (/online, /latest) лимитером НЕ покрыты — их фронт
 * опрашивает каждые 10 секунд, и любой лимит сломал бы главную страницу.
 *
 * /robokassa и /delivery тоже без лимитера: туда стучится Robokassa
 * и внутренний ретрай, а ограничение здесь оборвало бы выдачу токенов.
 */
const playerLimiter = rateLimit({
  /*
   * Ник нужен один раз на клик по оплате. Оракул существования ников
   * защищаем от массового перебора, но не мешаем повторным кликам:
   * раньше стоял 1 запрос за 5 секунд, и второй клик гарантированно
   * давал 429 с ложной подсветкой поля ника.
   */
  windowMs: 10 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false
});

const promocodeLimiter = rateLimit({
  /*
   * Фронт пингует раз в секунду во время ввода (debounce), плюс один
   * запрос при уходе с поля и один на клик по оплате. Запас примерно
   * втрое против реального темпа, при этом машинный перебор по-прежнему
   * отсекается.
   */
  windowMs: 10 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
});

const createOrderLimiter = rateLimit({
  /*
   * Заказ пишет строку в БД, поэтому этот лимитер самый плотный из трёх.
   * До него запрос доходит только если ник и промокод уже прошли
   * проверку, так что реальные попытки сюда почти не попадают.
   */
  windowMs: 10 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false
});

/*
 * ---------------------------------------------------------------------------
 * Роуты
 * ---------------------------------------------------------------------------
 */
app.use('/', cacheRouter);
app.use('/player', playerLimiter, playersRouter);
app.use('/promocode', promocodeLimiter, promocodeRouter);
app.use('/create-order', createOrderLimiter, ordersRouter);
app.use('/robokassa', robokassaRouter);
app.use('/delivery', deliveryRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API запущен на порту ${PORT}`);
});
