import cors from 'cors';
import express from 'express';
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

// VERY IMPORTANT
// app.options('*', cors());

app.use(express.json());

// modular routes
import authRouter from './routes/auth.route';
import goalRouter from './routes/goal.route';
import resourceRouter from './routes/resource.route';
import learningLogRouter from './routes/learningLog.route';
import resourceProgress from './routes/resourceProgress.route';

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/goals', goalRouter);
app.use('/api/v1/goals/:goalId/resources', resourceRouter);
app.use('/api/v1/goals/:goalId/logs', learningLogRouter);
app.use(
  './api/v1/goals/:goalId/resources/:resourceId/progress',
  resourceProgress,
);

export default app;
