import { Schema, model, Types } from 'mongoose';

export interface GoalDocument {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'dropped';
  startDate?: Date;
  targetEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<GoalDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // critical for auth-based queries
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'dropped'],
      default: 'not_started',
      index: true,
    },

    startDate: {
      type: Date,
    },

    targetEndDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Goal = model<GoalDocument>('Goal', goalSchema);
