import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes

export default router;
