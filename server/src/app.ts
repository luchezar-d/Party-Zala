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

// Trust proxy - required for secure cookies behind Railway proxy
app.set('trust proxy', 1);

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

// Request logging middleware (before CORS)
app.use((req, res, next) => {
  console.log('\n📥 Incoming Request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    referer: req.headers.referer,
    'content-type': req.headers['content-type'],
    cookies: req.headers.cookie ? 'present' : 'none',
    'user-agent': req.headers['user-agent']?.substring(0, 50)
  });
  
  // Log response after it's sent
  const originalSend = res.send;
  res.send = function(data: any) {
    console.log('📤 Response:', {
      statusCode: res.statusCode,
      headers: {
        'set-cookie': res.getHeader('set-cookie') ? 'present' : 'none',
        'access-control-allow-origin': res.getHeader('access-control-allow-origin'),
        'access-control-allow-credentials': res.getHeader('access-control-allow-credentials')
      }
    });
    return originalSend.call(this, data);
  };
  
  next();
});

// CORS configuration - strict origin checking with credentials
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('🌐 CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin matches our client origin
    if (origin === config.CLIENT_ORIGIN) {
      console.log('✅ CORS: Allowing origin:', origin);
      callback(null, true);
    } else {
      console.warn('⚠️  CORS: Blocked unauthorized origin:', origin, '(expected:', config.CLIENT_ORIGIN + ')');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cookie parsing logging
app.use((req, res, next) => {
  if (Object.keys(req.cookies || {}).length > 0) {
    console.log('🍪 Parsed cookies:', {
      cookieNames: Object.keys(req.cookies),
      hasPrtyZalaToken: !!req.cookies.party_zala_token
    });
  }
  next();
});

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
