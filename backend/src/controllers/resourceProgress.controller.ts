// resourceProgress.controller.ts
import { Request, Response } from 'express';
import { ResourceProgress } from '../models/resourceProgress.model';
import { Resource } from '../models/resource.model';
import { Goal } from '../models/goal.model';

// POST : INIT progress (idempotent)
export const initResourceProgress = async (req: Request, res: Response) => {
  const { goalId, resourceId } = req.params;
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

  // Validate resource ownership
  const resource = await Resource.findOne({
    _id: resourceId,
    userId,
    isDeleted: false,
  });

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  // Idempotent init
  const existingProgress = await ResourceProgress.findOne({
    userId,
    resourceId,
  });

  if (existingProgress) {
    return res.status(200).json(existingProgress);
  }

  // fresh init
  const progress = await ResourceProgress.create({
    userId,
    goalId: goal._id,
    resourceId,
    consumedValue: 0,
    status: 'not_started',
  });

  return res.status(201).json(progress);
};

// GET : progress (with derived percentage)
export const getResourceProgress = async (req: Request, res: Response) => {
  const { resourceId } = req.params;
  const userId = req.user.userId;

  const progress = await ResourceProgress.findOne({
    userId,
    resourceId,
  });

  if (!progress) {
    return res.status(404).json({ message: 'Progress not found' });
  }

  const resource = await Resource.findById(resourceId);
  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  const progressPercent = Math.min(
    Math.round((progress.consumedValue / resource.totalValue) * 100),
    100,
  );

  return res.status(200).json({
    ...progress.toObject(),
    progressPercent,
    totalValue: resource.totalValue,
    totalUnit: resource.totalUnit,
  });
};

// UPDATE : progress
export const updateResourceProgress = async (req: Request, res: Response) => {
  const { resourceId } = req.params;
  const userId = req.user.userId;

  const progress = await ResourceProgress.findOne({
    userId,
    resourceId,
  });

  if (!progress) {
    return res.status(404).json({ message: 'Progress not found' });
  }

  const resource = await Resource.findById(resourceId);
  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  const { consumedValue, status, dropReason, dropNote } = req.body;

  // 🚫 No updates allowed after drop
  if (progress.status === 'dropped') {
    return res.status(400).json({
      message: 'Dropped resource progress cannot be modified',
    });
  }

  // ---- HANDLE DROP (user-initiated) ----
  if (status === 'dropped') {
    if (!dropReason || !dropNote) {
      return res.status(400).json({
        message:
          'dropReason and dropNote are mandatory when dropping a resource',
      });
    }

    progress.status = 'dropped';
    progress.dropReason = dropReason;
    progress.dropNote = dropNote;
    progress.droppedAt = new Date();
    progress.lastAccessedAt = new Date();

    await progress.save();
    return res.status(200).json(progress);
  }

  // ---- HANDLE CONSUMPTION ----
  if (typeof consumedValue === 'number') {
    if (consumedValue < 0) {
      return res
        .status(400)
        .json({ message: 'consumedValue cannot be negative' });
    }

    // Start lifecycle
    if (progress.status === 'not_started' && consumedValue > 0) {
      progress.status = 'in_progress';
      progress.startedAt = new Date();
    }

    // Clamp
    progress.consumedValue = Math.min(consumedValue, resource.totalValue);

    // Completion
    if (progress.consumedValue === resource.totalValue) {
      progress.status = 'completed';
      progress.completedAt = new Date();
    }

    progress.lastAccessedAt = new Date();
  }

  await progress.save();

  const progressPercent = Math.min(
    Math.round((progress.consumedValue / resource.totalValue) * 100),
    100,
  );

  return res.status(200).json({
    ...progress.toObject(),
    progressPercent,
    totalValue: resource.totalValue,
    totalUnit: resource.totalUnit,
  });
};
