import { Schema, model, Types } from 'mongoose';

export interface ResourceDocument {
  userId: Types.ObjectId;
  goalId: Types.ObjectId;
  title: string;
  type: 'video' | 'article' | 'course' | 'book' | 'docs' | 'other';
  sourceUrl?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  instructor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<ResourceDocument>(
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

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    type: {
      type: String,
      enum: ['video', 'article', 'course', 'book', 'docs', 'other'],
      required: true,
      index: true,
    },

    sourceUrl: {
      type: String,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },

    instructor: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  },
);

export const Resource = model<ResourceDocument>('Resource', resourceSchema);
