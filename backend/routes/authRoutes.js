import express from 'express';
import authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateOwnerRegister, validateLogin } from '../middleware/validator.js';

/**
 * AUTH ROUTES
 * Defines authentication endpoints
 * NO business logic - just routing
 */

const router = express.Router();

// ============================================
// GOOGLE OAUTH ROUTES (For Users)
// ============================================

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get('/google', authController.googleAuth);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback', authController.googleCallback);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Protected
 */
router.get('/me', authenticate, authController.getCurrentUser);

// ============================================
// MESS OWNER AUTH ROUTES
// ============================================

/**
 * @route   POST /api/auth/owner/register
 * @desc    Register new mess owner
 * @access  Public
 */
router.post(
  '/owner/register',
  validateOwnerRegister,
  authController.registerOwner
);

/**
 * @route   POST /api/auth/owner/login
 * @desc    Mess owner login
 * @access  Public
 */
router.post(
  '/owner/login',
  validateLogin,
  authController.loginOwner
);

// ============================================
// ADMIN AUTH ROUTES
// ============================================

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post(
  '/admin/login',
  validateLogin,
  authController.loginAdmin
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (client deletes token)
 * @access  Protected
 */
router.post('/logout', authenticate, authController.logout);

export default router;