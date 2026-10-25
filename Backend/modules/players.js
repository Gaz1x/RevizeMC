import { Router } from 'express';
import dbPool from '../lib/db.js';
import { safeUsername } from '../lib/validators.js';

const playersRouter = Router();

playersRouter.get('/:username', async (req, res) => {
  const { username } = req.params;

  if (!safeUsername(username)) {
    return res.status(400).json({
      error: 'Некорректный формат имени пользователя'
    });
  }

  try {
    const [playerRows] = await dbPool.query(
      `
      SELECT PLAYER_NAME
      FROM revizemc_servervariables.servervariables_players
      WHERE PLAYER_NAME = ?
      LIMIT 1
      `,
      [username]
    );

    return res.json({
      exists: playerRows.length > 0
    });
  } catch (error) {
    console.error('Ошибка проверки игрока:', error);

    return res.status(500).json({
      error: 'Внутренняя ошибка сервера'
    });
  }
});

export default playersRouter;
