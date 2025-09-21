import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/jwt.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Find user with password included
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token and set cookie
    const token = generateToken(user._id.toString());
    setTokenCookie(res, token);

    // Return user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Login error:', error);
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

export async function me(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
