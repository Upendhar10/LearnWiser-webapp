import { Schema, model, Types, Document } from 'mongoose';

export interface ResourceDocument extends Document {
  userId: Types.ObjectId;
  goalRef: Types.ObjectId;

  resourceId: string;

  title: string;
  type: 'video' | 'article' | 'course' | 'book' | 'docs';

  totalValue: number;
  totalValueUnit: 'pages' | 'minutes' | 'modules';

  sourceUrl?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  instructor?: string;

  isDeleted: boolean;
  deletedAt?: Date;

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

    goalRef: {
      type: Schema.Types.ObjectId,
      ref: 'Goal',
      required: true,
      index: true,
    },

    resourceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 150,
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
      enum: ['video', 'article', 'course', 'book', 'docs'],
      required: true,
      index: true,
    },

    totalValue: {
      type: Number,
      min: 1,
      required: true,
    },

    totalValueUnit: {
      type: String,
      enum: ['pages', 'minutes', 'modules'],
      required: true,
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

// Enforce type → unit consistency
resourceSchema.pre('validate', function (this: ResourceDocument) {
  const allowedUnitsByType: Record<
    ResourceDocument['type'],
    ResourceDocument['totalValueUnit'][]
  > = {
    book: ['pages'],
    docs: ['pages'],
    article: ['minutes'],
    video: ['minutes'],
    course: ['modules'],
  };

  const allowed = allowedUnitsByType[this.type];

  if (!allowed.includes(this.totalValueUnit)) {
    throw new Error(
      `Resource type "${this.type}" only supports units: ${allowed.join(', ')}`,
    );
  }
});

// Generate resourceId
resourceSchema.pre('save', function () {
  if (this.resourceId) return;

  // const goalShortId = this.goalId.toString().slice(-6);
  const userShortId = this.userId.toString().slice(-6);
  const randomStr = Math.random().toString(36).substring(2, 8);

  this.resourceId = `res_${userShortId}_${randomStr}`;
});

// relation mapping
resourceSchema.index({ userId: 1, goalId: 1, isDeleted: 1 });

export const Resource = model<ResourceDocument>('Resource', resourceSchema);
