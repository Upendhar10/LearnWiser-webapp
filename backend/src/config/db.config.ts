import mongoose from 'mongoose';
import { DB_NAME } from '../constants';
import { MONGODB_URI } from './env.config';

const connectDB = async (): Promise<void> => {
  try {
    console.log(MONGODB_URI, DB_NAME);
    const DbInstance = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    console.log(DbInstance.connection);
    console.log(`MONGO_DB Connection Successful`);
  } catch (error) {
    if (error instanceof Error) {
      console.error('MongoDB connection error:', error.message);
    } else {
      console.error('Unknown MongoDB connection error:', error);
    }
    throw error; // IMPORTANT : If DB fails, the server must not start.
  }
};

export default connectDB;
