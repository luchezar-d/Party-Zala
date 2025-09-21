import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User, IUser } from '../models/User.js';

declare global {
  namespace Express {
    interface Request {
      cookies: { [key: string]: string };
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies[config.COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
