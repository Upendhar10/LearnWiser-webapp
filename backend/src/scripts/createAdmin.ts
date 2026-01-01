import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/env.config';

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    const adminEmail = ADMIN_EMAIL;
    const adminPassword = ADMIN_PASSWORD;

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: 'LearnWiser Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin', error);
    process.exit(1);
  }
};

createAdmin();
