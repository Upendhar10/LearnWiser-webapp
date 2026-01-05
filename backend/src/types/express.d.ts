import { JwtTokenPayload } from '../utils/jwt';

/*
We will attach user info to req, like:

req.user = {
  userId,
  role
}

But, Express Request does not have user by default. 
So, we must extend Request type
*/

declare global {
  namespace Express {
    interface Request {
      user?: JwtTokenPayload;
    }
  }
}
