import { Router } from 'express';
import { getGoal, saveGoal } from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getGoal());
});

router.put('/', (req, res) => {
  const { target } = req.body as { target: number };
  const current = getGoal();
  const updated = saveGoal({ ...current, target: Math.max(0, Number(target) || 0) });
  res.json(updated);
});

export default router;
