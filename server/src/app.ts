import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import partyRoutes from './routes/partyRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting for auth routes (disabled in development)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.NODE_ENV === 'development' ? 1000 : 5, // Very high limit in development
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.NODE_ENV === 'development', // Skip rate limiting entirely in development
});

// CORS configuration
app.use(cors({
  origin: config.CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply rate limiting to auth routes (only in production)
if (config.NODE_ENV !== 'development') {
  app.use('/api/auth', authLimiter);
}

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/parties', partyRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
