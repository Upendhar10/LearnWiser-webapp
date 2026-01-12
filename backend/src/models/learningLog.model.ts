import { Schema, model, Types, Document } from 'mongoose';

export interface LearningLogDocument extends Document {
  userId: Types.ObjectId;
  goalId: Types.ObjectId;
  resourceId?: Types.ObjectId;

  logId: string;

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

    logId: {
      type: String,
      unique: true,
      index: true,
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
      default: 'medium',
    },
  },
  {
    timestamps: true,
  },
);

learningLogSchema.pre('save', function () {
  if (this.logId) return;

  const userShortId = this.userId.toString().slice(-3);
  const randomStr = Math.random().toString(36).substring(2, 6);

  this.logId = `log_${userShortId}_${randomStr}`;
});

export const LearningLog = model<LearningLogDocument>(
  'LearningLog',
  learningLogSchema,
);
