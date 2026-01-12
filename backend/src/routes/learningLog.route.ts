import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { createLearningLog } from '../controllers/learningLog.controller';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

// POST : create a LearningLog under a goal
router.post('/', createLearningLog);

export default router;
