import express from 'express';
const app = express();

app.use(express.json());

// modular routes
import authRouter from './routes/auth.route';
import goalRouter from './routes/goal.route';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/goals', goalRouter);

export default app;
