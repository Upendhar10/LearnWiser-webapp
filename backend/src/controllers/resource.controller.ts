// resource.controller.ts
import { Request, Response } from 'express';
import { Resource } from '../models/resource.model';
import { Goal } from '../models/goal.model';

// CREATE a Resource (POST)
export const createResource = async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const userId = req.user.userId;

  const { title, type, sourceUrl, difficulty, instructor } = req.body;

  if (!title || !type) {
    return res.status(400).json({
      message: 'Title and type are mandatory fields',
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
    goalId: goal._id, // ✅ store ObjectId
    title,
    type,
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
    goalId: goal._id,
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
    'sourceUrl',
    'difficulty',
    'instructor',
  ];

  const updates: Record<string, any> = {};
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
    { new: true },
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

  return res.status(200).json({ message: 'Resource deleted successfully' });
};
