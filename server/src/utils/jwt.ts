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
  
  // Set cookie with explicit domain for better cross-device compatibility
  res.cookie(config.COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction, // Only HTTPS in production
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin, requires secure=true
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
    // Don't set domain in development, let browser handle it
    ...(isProduction && { domain: undefined }) // Let Railway handle domain
  });
  
  console.log('🍪 Cookie set:', {
    name: config.COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: '7 days',
    path: '/'
  });
}

export function clearTokenCookie(res: Response): void {
  const isProduction = config.NODE_ENV === 'production';
  
  res.clearCookie(config.COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  });
  
  console.log('🍪 Cookie cleared:', config.COOKIE_NAME);
}
