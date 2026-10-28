import { Router } from 'express';
import dbPool from '../lib/db.js';

const cacheRouter = Router();

/*
 * ---------------------------------------------------------------------------
 * Кэш последних покупок (/latest)
 * ---------------------------------------------------------------------------
 */

let cachedLatests = [];
let isCacheReady = false;

async function updateLatestsCache() {
  try {
    const [rows] = await dbPool.query(`
      SELECT username, action
      FROM revizemc_api.action
      WHERE type = 'Покупка'
      ORDER BY \`row\` DESC
      LIMIT 10
    `);

    cachedLatests = rows;
    isCacheReady = true;
  } catch (error) {
    console.error('Ошибка обновления кэша покупок:', error);
  }
}

updateLatestsCache();
setInterval(updateLatestsCache, 10000);

/*
 * ---------------------------------------------------------------------------
 * Кэш онлайна (/online)
 * ---------------------------------------------------------------------------
 */

const BASE_MODES = ['SUNSET', 'CLASSIC', 'OCEANS'];

let cachedOnline = {
  servers: [],
  total: 0
};

let isOnlineCacheReady = false;

async function updateOnlineCache() {
  try {
    const [rows] = await dbPool.query(`
      SELECT server, online
      FROM revizemc_api.online
    `);

    const totalOnline = rows.reduce(
      (sum, server) => sum + Number(server.online),
      0
    );

    const processedServers = BASE_MODES.map((baseId) => {
      const matchingServers = rows.filter((row) =>
        String(row.server).toUpperCase().includes(baseId)
      );

      const serverTotal = matchingServers.reduce(
        (sum, server) => sum + Number(server.online),
        0
      );

      return {
        id: baseId,
        players: serverTotal
      };
    });

    cachedOnline = {
      servers: processedServers,
      total: totalOnline
    };

    isOnlineCacheReady = true;
  } catch (error) {
    console.error('Ошибка обновления онлайна:', error);
  }
}

updateOnlineCache();
setInterval(updateOnlineCache, 10000);

/*
 * ---------------------------------------------------------------------------
 * Роуты, отдающие кэш
 * ---------------------------------------------------------------------------
 */

cacheRouter.get('/online', (req, res) => {
  if (!isOnlineCacheReady) {
    return res.status(503).json({
      error: 'Данные загружаются, попробуйте позже'
    });
  }

  return res.json(cachedOnline);
});

cacheRouter.get('/latest', (req, res) => {
  if (!isCacheReady) {
    return res.status(503).json({
      error: 'Данные загружаются, попробуйте позже'
    });
  }

  return res.json(cachedLatests);
});

/*
 * Экспортируется для /robokassa/result — после выдачи токенов
 * кэш покупок нужно обновить сразу, не дожидаясь интервала.
 */
export { updateLatestsCache };

export default cacheRouter;
