import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment Variables');
}

const JWT_SECRET_KEY = JWT_SECRET as string;

interface JwtTokenPayload {
  userId: string;
  role: 'user' | 'admin' | undefined;
}

function generateJWTtoken(
  payload: JwtTokenPayload,
  expiresIn: string = '1d',
): string {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn,
  });
}

function verifyJWTtoken(token: string): JwtTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET_KEY) as jwt.JwtPayload;

  return {
    userId: decoded.userId as string,
    role: decoded.role as 'user' | 'admin',
  };
}

export { generateJWTtoken, verifyJWTtoken };
