import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        message: 'Invalid email address',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    // check if already user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error!',
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    // check if user exists in the database
    const reqUser = await User.findOne({ email });

    if (!reqUser) {
      return res.status(401).json({
        message: 'Invalid Credentials',
      });
    }

    // password comparison
    const isPasswordMatch = await bcrypt.compare(password, reqUser.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: 'Invalid Credentials',
      });
    }

    return res.status(200).json({
      message: 'Login Sucessfull',
      user: {
        id: reqUser._id,
        name: reqUser.name,
        email: reqUser.email,
        role: reqUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error!',
    });
  }
};

export { registerUser, loginUser };
