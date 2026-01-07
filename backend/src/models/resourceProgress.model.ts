import { Schema, model, Types } from 'mongoose';

export interface ResourceProgressDocument {
  userId: Types.ObjectId;
  goalId: Types.ObjectId;
  resourceId: Types.ObjectId;

  status: 'not_started' | 'in_progress' | 'completed' | 'dropped';

  // Raw progress signal (optional & flexible)
  progressValue?: number;
  progressUnit?: 'percent' | 'pages' | 'minutes' | 'lessons';

  // Drop intelligence (only meaningful if status === "dropped")
  dropReason?:
    | 'too_difficult'
    | 'too_easy'
    | 'poor_explanation'
    | 'not_relevant'
    | 'lack_of_time'
    | 'switched_resource'
    | 'other';

  dropNote?: string;

  // Lifecycle timestamps
  startedAt?: Date;
  completedAt?: Date;
  droppedAt?: Date;
  lastAccessedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const resourceProgressSchema = new Schema<ResourceProgressDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    goalId: {
      type: Schema.Types.ObjectId,
      ref: 'Goal',
      required: true,
      index: true,
    },

    resourceId: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'dropped'],
      default: 'not_started',
      index: true,
    },

    progressValue: {
      type: Number,
      min: 0,
    },

    progressUnit: {
      type: String,
      enum: ['percent', 'pages', 'minutes', 'lessons'],
    },

    dropReason: {
      type: String,
      enum: [
        'too_difficult',
        'too_easy',
        'poor_explanation',
        'not_relevant',
        'lack_of_time',
        'switched_resource',
        'other',
      ],
    },

    dropNote: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    startedAt: Date,
    completedAt: Date,
    droppedAt: Date,
    lastAccessedAt: Date,
  },
  {
    timestamps: true,
  },
);

// Enforce one progress document per user per resource
resourceProgressSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

export const ResourceProgress = model<ResourceProgressDocument>(
  'ResourceProgress',
  resourceProgressSchema,
);
