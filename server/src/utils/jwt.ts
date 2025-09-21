import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { config } from '../config/env.js';

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES
  });
}

export function setTokenCookie(res: Response, token: string): void {
  res.cookie(config.COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.COOKIE_SECURE,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });
}

export function clearTokenCookie(res: Response): void {
  res.clearCookie(config.COOKIE_NAME, {
    httpOnly: true,
    secure: config.COOKIE_SECURE,
    sameSite: 'lax',
    path: '/'
  });
}
