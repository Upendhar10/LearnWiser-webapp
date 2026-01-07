import { Schema, model, Types } from 'mongoose';

export interface LearningLogDocument {
  userId: Types.ObjectId;
  goalId: Types.ObjectId;
  resourceId?: Types.ObjectId;

  title: string;
  notes: string;

  timeSpentMinutes?: number;
  effortLevel?: 'low' | 'medium' | 'high';

  createdAt: Date;
  updatedAt: Date;
}

const learningLogSchema = new Schema<LearningLogDocument>(
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
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    notes: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    timeSpentMinutes: {
      type: Number,
      min: 1,
    },

    effortLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
  },
  {
    timestamps: true,
  },
);

export const LearningLog = model<LearningLogDocument>(
  'LearningLog',
  learningLogSchema,
);
