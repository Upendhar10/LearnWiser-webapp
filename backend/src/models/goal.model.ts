import { Schema, model, Types, Document } from 'mongoose';

export interface GoalDocument extends Document {
  userId: Types.ObjectId;
  goalId: string;

  title: string;
  description?: string;

  status: 'not_started' | 'in_progress' | 'completed' | 'dropped';

  startDate?: Date;
  targetEndDate?: Date;

  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<GoalDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    goalId: {
      type: String,
      unique: true,
      index: true,
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

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

goalSchema.pre('save', function (this: GoalDocument) {
  if (this.goalId) return;

  const userShortId = this.userId.toString().slice(-6);
  const randomStr = Math.random().toString(36).substring(2, 8);

  this.goalId = `goal_${userShortId}_${randomStr}`;
});

export const Goal = model<GoalDocument>('Goal', goalSchema);
