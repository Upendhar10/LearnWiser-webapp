import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import {
  createResource,
  getResourceByGoal,
  getResourceById,
  updateResource,
  deleteResource,
} from '../controllers/resource.controller';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

// Create resource under a goal
router.post('/', createResource);

// Get all resources for a goal
router.get('/', getResourceByGoal);

// Get single resource
router.get('/:resourceId', getResourceById);

// Update resource
router.patch('/:resourceId', updateResource);

// Delete resource
router.delete('/:resourceId', deleteResource);

export default router;
