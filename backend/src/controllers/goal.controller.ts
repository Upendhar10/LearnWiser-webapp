import { Request, Response } from 'express';
import { Goal } from '../models/goal.model';
import { LearningSession } from '../models/learningSession.model';

// Create Goal
export const createGoal = async (req: Request, res: Response) => {
  const { title, description, startDate, targetEndDate } = req.body;

  console.log(req.user.userId);

  const goal = await Goal.create({
    userId: req.user.userId,
    title,
    description,
    startDate,
    targetEndDate,
  });

  res.status(201).json({
    success: true,
    goal,
  });
};

// Get All Goals (excluding deleted)
export const getAllGoals = async (req: Request, res: Response) => {
  const { status } = req.query;

  const filter: any = {
    userId: req.user.userId,
    isDeleted: false,
  };

  if (status) {
    filter.status = status;
  }

  const goals = await Goal.find(filter).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: goals.length,
    goals,
  });
};

// Get Single Goal
export const getGoalById = async (req: Request, res: Response) => {
  const goal = await Goal.findOne({
    goalId: req.params.goalId,
    userId: req.user.userId,
    isDeleted: false,
  });

  console.log(req);

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  res.json({
    success: true,
    goal,
  });
};

// Update Goal (metadata only)
export const updateGoal = async (req: Request, res: Response) => {
  const goal = await Goal.findOneAndUpdate(
    {
      goalId: req.params.goalId,
      userId: req.user.userId,
      isDeleted: false,
    },
    req.body,
    { new: true, runValidators: true },
  );

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  res.json({
    success: true,
    goal,
  });
};

// Update Goal Status
export const updateGoalStatus = async (req: Request, res: Response) => {
  const { status } = req.body;

  const goal = await Goal.findOneAndUpdate(
    {
      goalId: req.params.goalId,
      userId: req.user.userId,
      isDeleted: false,
    },
    { status },
    { new: true },
  );

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  res.json({
    success: true,
    goal,
  });
};

// Soft Delete Goal
export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    const userId = req.user.userId;

    // 1. Soft delete goal
    const goal = await Goal.findOneAndUpdate(
      {
        goalId,
        userId,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true },
    );

    // 2. Validate existence
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // 3. Cascade delete learning sessions
    await LearningSession.updateMany(
      {
        goalRef: goal._id,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: 'goal',
        },
      },
    );

    return res.json({
      success: true,
      message: 'Goal deleted successfully',
      goal,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};
