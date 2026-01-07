import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';

import {
  createGoal,
  getAllGoals,
  getGoalById,
  updateGoal,
  updateGoalStatus,
  deleteGoal,
} from '../controllers/goal.controller';

const router = Router();

router.use(authMiddleware);

// GET Route
router.get('/', getAllGoals);
router.get('/:goalId', getGoalById);

// POST route
router.post('/', createGoal);

// Update
router.patch('/:goalId', updateGoal);
router.patch('/:goalId/status', updateGoalStatus);

// delete
router.delete('/:goalId', deleteGoal);

export default router;
