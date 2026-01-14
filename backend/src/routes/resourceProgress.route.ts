import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import {
  initResourceProgress,
  getResourceProgress,
  updateResourceProgress,
} from '../controllers/resourceProgress.controller';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

// routes
router.post('/', initResourceProgress);
router.get('/', getResourceProgress);
router.patch('/', updateResourceProgress);

export default router;
