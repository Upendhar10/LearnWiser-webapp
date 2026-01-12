import express from 'express';
const app = express();

app.use(express.json());

// modular routes
import authRouter from './routes/auth.route';
import goalRouter from './routes/goal.route';
import resourceRouter from './routes/resource.route';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/goals', goalRouter);
app.use('/api/v1/goals/:goalId/resources', resourceRouter);

export default app;
