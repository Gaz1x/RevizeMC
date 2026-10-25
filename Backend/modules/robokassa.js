import '../lib/env.js';
import { Router } from 'express';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import crypto from 'node:crypto';
import dbPool from '../lib/db.js';
import {
  safeUsername,
  safeTokenAmount,
  normalizeAmount
} from '../lib/validators.js';
import { updateLatestsCache } from './cache.js';

const execFileAsync = promisify(execFile);

const isTest = process.env.ROBOKASSA_TEST === 'true';

const ROBOKASSA_PASSWORD_1 = isTest
  ? process.env.ROBOKASSA_TEST_PASSWORD_1
  : process.env.ROBOKASSA_PASSWORD_1;

const ROBOKASSA_PASSWORD_2 = isTest
  ? process.env.ROBOKASSA_TEST_PASSWORD_2
  : process.env.ROBOKASSA_PASSWORD_2;

const ROBOKASSA_LOGIN = process.env.ROBOKASSA_LOGIN;
const ROBOKASSA_TEST = isTest;

if (
  !ROBOKASSA_LOGIN ||
  !ROBOKASSA_PASSWORD_1 ||
  !ROBOKASSA_PASSWORD_2
) {
  throw new Error(
    'Не заданы настройки Robokassa для выбранного режима'
  );
}

function md5(value) {
  return crypto
    .createHash('md5')
    .update(value, 'utf8')
    .digest('hex');
}

export function createRobokassaUrl({
  invoiceId,
  amount,
  description
}) {
  const outSum = Number(amount).toFixed(2);

  const signature = md5(
    `${ROBOKASSA_LOGIN}:${outSum}:${invoiceId}:${ROBOKASSA_PASSWORD_1}`
  );

  const params = new URLSearchParams({
    MerchantLogin: ROBOKASSA_LOGIN,
    OutSum: outSum,
    InvId: String(invoiceId),
    Description: description,
    SignatureValue: signature,
    Culture: 'ru'
  });

  if (ROBOKASSA_TEST) {
    params.set('IsTest', '1');
  }

  return `https://auth.robokassa.ru/Merchant/Index.aspx?${params.toString()}`;
}

async function giveTokens(username, tokenAmount) {
  if (!safeUsername(username)) {
    throw new Error('Некорректный username');
  }

  if (!safeTokenAmount(tokenAmount)) {
    throw new Error('Некорректное количество токенов');
  }

  /*
   * ВАЖНО:
   * argv передаются как отдельные аргументы tmux.
   * Поэтому username и tokenAmount не теряются
   * и не могут изменить структуру команды.
   */
  const command = [
    'skript_action',
    username,
    String(tokenAmount),
    'Покупка'
  ].join(' ');

  await execFileAsync('tmux', [
    'send-keys',
    '-t',
    'lobby',
    command,
    'Enter'
  ]);
}

/*
 * ---------------------------------------------------------------------------
 * Result URL Robokassa:  https://api.revizemc.net/robokassa/result
 * ---------------------------------------------------------------------------
 */
const robokassaRouter = Router();

robokassaRouter.post('/result', async (req, res) => {
  const {
    OutSum,
    InvId,
    SignatureValue
  } = req.body;

  if (!OutSum || !InvId || !SignatureValue) {
    return res.status(400).send('Bad request');
  }

  const expectedSignature = md5(
    `${OutSum}:${InvId}:${ROBOKASSA_PASSWORD_2}`
  );

  if (
    expectedSignature.toLowerCase() !==
    String(SignatureValue).toLowerCase()
  ) {
    console.error('Неверная подпись Robokassa', {
      InvId,
      OutSum
    });

    return res.status(400).send('Invalid signature');
  }

  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `
      SELECT
        id,
        invoice_id,
        username,
        promocode,
        token_amount,
        amount,
        status
      FROM revizemc_robokassa.robokassa_orders
      WHERE invoice_id = ?
      FOR UPDATE
      `,
      [InvId]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).send('Order not found');
    }

    const order = rows[0];

    const expectedAmount = normalizeAmount(order.amount);
    const receivedAmount = normalizeAmount(OutSum);

    if (
      expectedAmount === null ||
      receivedAmount === null ||
      expectedAmount !== receivedAmount
    ) {
      await connection.rollback();

      console.error('Сумма платежа не совпадает', {
        InvId,
        expectedAmount,
        receivedAmount
      });

      return res.status(400).send('Invalid amount');
    }

    if (!safeTokenAmount(order.token_amount)) {
      await connection.rollback();

      console.error('В заказе некорректное количество токенов', {
        InvId,
        tokenAmount: order.token_amount
      });

      return res.status(400).send('Invalid token amount');
    }

    /*
     * Robokassa может повторно отправить уведомление.
     * В этом случае повторно токены не выдаём.
     */
    if (
      order.status === 'paid' ||
      order.status === 'delivery_failed'
    ) {
      await connection.commit();
      return res.send(`OK${InvId}`);
    }

    await connection.query(
      `
      UPDATE revizemc_robokassa.robokassa_orders
      SET
        status = 'paid',
        paid_at = NOW()
      WHERE invoice_id = ?
      `,
      [InvId]
    );

    await connection.commit();

    try {
      await giveTokens(
        order.username,
        order.token_amount
      );

      await connection.query(
        `
        UPDATE revizemc_robokassa.robokassa_orders
        SET command_sent_at = NOW()
        WHERE invoice_id = ?
        `,
        [InvId]
      );

      await updateLatestsCache();

      return res.send(`OK${InvId}`);
    } catch (deliveryError) {
      console.error('Команда не отправлена на Minecraft:', deliveryError);

      await dbPool.query(
        `
        UPDATE revizemc_robokassa.robokassa_orders
        SET
          status = 'delivery_failed',
          last_error = ?
        WHERE invoice_id = ?
        `,
        [
          String(deliveryError.message || deliveryError),
          InvId
        ]
      );

      /*
       * Деньги уже подтверждены, поэтому не возвращаем
       * ошибку Robokassa бесконечно. Заказ помечен для повторной доставки.
       */
      return res.send(`OK${InvId}`);
    }
  } catch (error) {
    try {
      await connection.rollback();
    } catch {}

    console.error('Ошибка Result URL:', error);

    return res.status(500).send('Internal error');
  } finally {
    connection.release();
  }
});

/*
 * ---------------------------------------------------------------------------
 * Повторная доставка заказов, упавших на этапе отправки в tmux
 * ---------------------------------------------------------------------------
 */
const deliveryRouter = Router();

deliveryRouter.post('/retry', async (req, res) => {
  const {
    invoiceId,
    secret
  } = req.body;

  if (
    secret !== process.env.INTERNAL_RETRY_SECRET ||
    !invoiceId
  ) {
    return res.status(403).json({
      error: 'Forbidden'
    });
  }

  try {
    const [rows] = await dbPool.query(
      `
      SELECT invoice_id, username, token_amount
      FROM revizemc_robokassa.robokassa_orders
      WHERE invoice_id = ?
        AND status = 'delivery_failed'
        AND command_sent_at IS NULL
      LIMIT 1
      `,
      [invoiceId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Заказ не найден'
      });
    }

    const order = rows[0];

    await giveTokens(
      order.username,
      order.token_amount
    );

    await dbPool.query(
      `
      UPDATE revizemc_robokassa.robokassa_orders
      SET
        command_sent_at = NOW(),
        status = 'paid',
        last_error = NULL
      WHERE invoice_id = ?
      `,
      [invoiceId]
    );

    return res.json({
      success: true
    });
  } catch (error) {
    console.error('Ошибка повторной выдачи:', error);

    return res.status(500).json({
      error: 'Не удалось повторить выдачу'
    });
  }
});

export { robokassaRouter, deliveryRouter };
