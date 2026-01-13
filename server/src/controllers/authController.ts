import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/jwt.js';

export async function login(req: Request, res: Response) {
  try {
    console.log('🔐 Login attempt:', { 
      email: req.body.email,
      origin: req.headers.origin,
      userAgent: req.headers['user-agent']?.substring(0, 50)
    });

    const { email, password } = req.body;

    // Find user with password included
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      console.log('❌ Login failed: User not found', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      console.log('❌ Login failed: Invalid password', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token and set cookie
    const token = generateToken((user._id as any).toString());
    console.log('🔑 Token generated:', {
      userId: user._id,
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...'
    });

    setTokenCookie(res, token);
    console.log('🍪 Cookie set with options:', {
      cookieName: 'party_zala_token',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: '7 days'
    });

    // Return user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    console.log('✅ Login successful:', { 
      userId: user._id, 
      email: user.email,
      responseHeaders: Object.keys(res.getHeaders())
    });

    res.json({ user: userData });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    clearTokenCookie(res);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function me(req: Request, res: Response) {
  try {
    console.log('👤 /auth/me request:', {
      hasUser: !!req.user,
      cookies: req.cookies,
      cookieNames: Object.keys(req.cookies || {}),
      origin: req.headers.origin,
      authorization: req.headers.authorization ? 'present' : 'missing'
    });

    if (!req.user) {
      console.log('❌ /auth/me failed: No user in request');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Get full user data from database
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('❌ /auth/me failed: User not found in DB', { userId: req.user._id });
      return res.status(401).json({ message: 'User not found' });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    console.log('✅ /auth/me successful:', { userId: user._id, email: user.email });
    res.json({ user: userData });
  } catch (error) {
    console.error('❌ /auth/me error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
