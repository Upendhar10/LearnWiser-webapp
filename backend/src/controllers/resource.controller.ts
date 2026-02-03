import { Request, Response } from 'express';
import { Resource } from '../models/resource.model';
import { Goal } from '../models/goal.model';
import { LearningSession } from '../models/learningSession.model';

// CREATE a Resource (POST)
export const createResource = async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const userId = req.user.userId;

  const {
    title,
    type,
    totalValue,
    totalValueUnit,
    sourceUrl,
    difficulty,
    instructor,
  } = req.body;

  // Basic validation
  if (!title || !type || !totalValue || !totalValueUnit) {
    return res.status(400).json({
      message: 'title, type, totalValue and totalUnit are required',
    });
  }

  // Verify goal ownership
  const goal = await Goal.findOne({
    goalId,
    userId,
    isDeleted: false,
  });

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  const resource = await Resource.create({
    userId,
    goalRef: goal._id, // store ObjectId  of goal
    title,
    type,
    totalValue,
    totalValueUnit,
    sourceUrl,
    difficulty,
    instructor,
  });

  return res.status(201).json(resource);
};

// GET single Resource
export const getResourceById = async (req: Request, res: Response) => {
  const { resourceId } = req.params;

  const resource = await Resource.findOne({
    resourceId,
    userId: req.user.userId,
    isDeleted: false,
  });

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  return res.status(200).json(resource);
};

// GET all Resources under a Goal
export const getResourceByGoal = async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const userId = req.user.userId;

  const goal = await Goal.findOne({
    goalId,
    userId,
    isDeleted: false,
  });

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  const resources = await Resource.find({
    goalRef: goal._id,
    userId,
    isDeleted: false,
  }).sort({ createdAt: 1 });

  return res.status(200).json(resources);
};

// UPDATE Resource (PATCH)
export const updateResource = async (req: Request, res: Response) => {
  const { resourceId } = req.params;

  const allowedUpdates = [
    'title',
    'type',
    'totalValue',
    'totalValueUnit',
    'sourceUrl',
    'difficulty',
    'instructor',
  ];

  const updates: Partial<Record<(typeof allowedUpdates)[number], any>> = {};
  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  const resource = await Resource.findOneAndUpdate(
    {
      resourceId,
      userId: req.user.userId,
      isDeleted: false,
    },
    updates,
    {
      new: true,
      runValidators: true, // important for schema validation
    },
  );

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  return res.status(200).json(resource);
};

// SOFT DELETE Resource
export const deleteResource = async (req: Request, res: Response) => {
  const { resourceId } = req.params;

  const resource = await Resource.findOneAndUpdate(
    {
      resourceId,
      userId: req.user.userId,
      isDeleted: false,
    },
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    { new: true },
  );

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  await LearningSession.updateMany(
    { resourceRef: resource._id, isDeleted: false },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    },
  );

  return res.status(200).json({ message: 'Resource deleted successfully' });
};
