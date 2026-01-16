import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getUserInfo,
} from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// protected route
router.get('/me', authMiddleware, getUserInfo);

// Private routes

export default router;
