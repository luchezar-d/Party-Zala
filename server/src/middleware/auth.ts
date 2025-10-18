import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../models/User.js';

declare global {
  namespace Express {
    interface Request {
      cookies: { [key: string]: string };
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('🔒 Auth middleware:', {
      path: req.path,
      method: req.method,
      cookieName: config.COOKIE_NAME,
      allCookies: req.cookies,
      cookieCount: Object.keys(req.cookies || {}).length,
      origin: req.headers.origin,
      hasToken: !!req.cookies[config.COOKIE_NAME]
    });

    const token = req.cookies[config.COOKIE_NAME];

    if (!token) {
      console.log('❌ Auth failed: No token in cookies');
      return res.status(401).json({ message: 'Authentication required' });
    }

    console.log('🔑 Token found:', {
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...'
    });

    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    console.log('✅ Token verified:', { userId: decoded.userId });

    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('❌ Auth failed: User not found in DB', { userId: decoded.userId });
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      _id: (user._id as any).toString(),
      email: user.email
    };
    
    console.log('✅ Auth successful:', { userId: user._id, email: user.email });
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('❌ Auth failed: Invalid JWT', { error: error.message });
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('❌ Auth error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
