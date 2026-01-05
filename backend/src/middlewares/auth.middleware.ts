import { Request, Response, NextFunction } from 'express';
import { verifyJWTtoken } from '../utils/jwt';

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Read JWT from the request Header
    const authHeader = req.headers.authorization;

    // Validate authHeader
    if (!authHeader) {
      return res.status(401).json({
        message: 'Authorization Header Missing',
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Invalid Authorization Format',
      });
    }

    // extract token form the authHeader
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Token Missing',
      });
    }

    // verify token and extract user Info
    const decoded = verifyJWTtoken(token);

    // attach user info to the request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or Expired Token',
    });
  }
}

export default authMiddleware;
