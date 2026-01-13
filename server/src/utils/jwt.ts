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
  
  // Use 'lax' sameSite since client and server are on same domain
  // This works better with iOS/Safari which blocks 'none' cookies more aggressively
  res.cookie(config.COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction, // Only HTTPS in production
    sameSite: 'lax', // 'lax' works for same-origin and is more compatible with iOS/Safari
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });
  
  console.log('🍪 Cookie set:', {
    name: config.COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: '7 days',
    path: '/'
  });
}

export function clearTokenCookie(res: Response): void {
  const isProduction = config.NODE_ENV === 'production';
  
  res.clearCookie(config.COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/'
  });
  
  console.log('🍪 Cookie cleared:', config.COOKIE_NAME);
}
