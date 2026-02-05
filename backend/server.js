// ===============================
// LOAD ENV FIRST (CRITICAL)
// ===============================
import dotenv from 'dotenv';
dotenv.config();

// ===============================
// IMPORTS
// ===============================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

// Config
import connectDB from './config/database.js';
import configureGoogleOAuth from './config/oauth.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import messRoutes from './routes/messRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Services
import authService from './services/authService.js';

// ===============================
// INIT APP
// ===============================
const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// MIDDLEWARE
// ===============================

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
});
app.use('/api', limiter);

// Passport (Google OAuth)
app.use(passport.initialize());
configureGoogleOAuth();

// ===============================
// ROUTES
// ===============================

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Match My Mess API is running',
    time: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/mess', messRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// ===============================
// ERROR HANDLING
// ===============================
app.use(notFound);
app.use(errorHandler);

// ===============================
// START SERVER
// ===============================
const startServer = async () => {
  try {
    console.log('🔍 MONGO_URI =', process.env.MONGO_URI);

    await connectDB();
    await authService.createDefaultAdmin();

    console.log('✅ Default admin verified');

    app.listen(PORT, () => {
      console.log(`
🚀 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
✨ Ready to accept requests!
      `);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
  process.exit(1);
});

startServer();

export default app;
