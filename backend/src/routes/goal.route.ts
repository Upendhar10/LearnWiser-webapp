import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// GET Route
router.get('/', authMiddleware, getAllGoals);
router.get('/:id', authMiddleware, getGoalById);

// POST route
router.get('/', authMiddleware, createNewGoal);

// Update
router.put('/:id', authMiddleware, updateGoal);
router.patch('/:id/status', authMiddleware, updateGoalStatus);

// delete
router.delete(':/id', authMiddleware, deleteGoal);

export default router;
