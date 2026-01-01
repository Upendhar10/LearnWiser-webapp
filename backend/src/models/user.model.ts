import { Document, Schema, model } from 'mongoose';

export interface Iuser extends Document {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

const userSchema = new Schema<Iuser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true },
);

export const User = model<Iuser>('User', userSchema);
