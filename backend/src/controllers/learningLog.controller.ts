// learning-log.controller.ts
import { Request, Response } from 'express';
import { LearningLog } from '../models/learningLog.model';
import { Goal } from '../models/goal.model';

export const createLearningLog = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    const userId = req.user.userId;

    // Validate goal ownership
    const goal = await Goal.findOne({
      goalId,
      userId,
      isDeleted: false,
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const { title, notes, resourceId, timeSpentMinutes, effortLevel } =
      req.body;

    if (!title || !notes) {
      return res.status(400).json({
        message: 'Title and notes are required',
      });
    }

    const log = await LearningLog.create({
      userId,
      goalId: goal._id,
      resourceId,
      title,
      notes,
      timeSpentMinutes,
      effortLevel,
    });

    return res.status(201).json(log);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Something went wrong!', error: error.message });
  }
};
