import express from 'express';
const app = express();

app.use(express.json());

// modular routes
import authRouter from './routes/auth.route';

app.use('/api/v1/auth', authRouter);

export default app;
