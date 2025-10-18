import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Response } from 'express';
import { config } from '../config/env.js';

export function generateToken(userId: string): string {
  const options: SignOptions = {
    expiresIn: config.JWT_EXPIRES as any
  };
  return jwt.sign({ userId }, config.JWT_SECRET as Secret, options);
}

export function setTokenCookie(res: Response, token: string): void {
  const isProduction = config.NODE_ENV === 'production';
  
  res.cookie(config.COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.COOKIE_SECURE,
    sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });
}

export function clearTokenCookie(res: Response): void {
  const isProduction = config.NODE_ENV === 'production';
  
  res.clearCookie(config.COOKIE_NAME, {
    httpOnly: true,
    secure: config.COOKIE_SECURE,
    sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin in production
    path: '/'
  });
}
