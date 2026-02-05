import express from 'express';
import messController from '../controllers/messController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { authorizeOwner } from '../middleware/roleAuth.js';
import {
  validateCreateMess,
  validateNearbyQuery,
  validateMongoId
} from '../middleware/validator.js';

/**
 * MESS ROUTES
 * Defines mess-related endpoints
 * NO business logic - just routing
 */

const router = express.Router();

// ============================================
// PUBLIC ROUTES (No Auth Required)
// ============================================

/**
 * @route   GET /api/mess
 * @desc    Get all approved messes with filters
 * @access  Public
 */
router.get('/', messController.getAllMesses);

/**
 * @route   GET /api/mess/nearby
 * @desc    Find nearby messes using geolocation
 * @access  Public
 */
router.get(
  '/nearby',
  validateNearbyQuery,
  messController.getNearbyMesses
);

/**
 * @route   GET /api/mess/:id
 * @desc    Get mess by ID (limited data if not authenticated)
 * @access  Public (with optional auth for full data)
 */
router.get(
  '/:id',
  validateMongoId('id'),
  optionalAuth,
  messController.getMessById
);

// ============================================
// PROTECTED ROUTES (Auth Required)
// ============================================

/**
 * @route   GET /api/mess/:id/contact
 * @desc    Get mess with full contact details
 * @access  Protected (Any authenticated user)
 */
router.get(
  '/:id/contact',
  validateMongoId('id'),
  authenticate,
  messController.getMessWithContact
);

// ============================================
// MESS OWNER ROUTES
// ============================================

/**
 * @route   POST /api/mess
 * @desc    Create new mess listing
 * @access  Protected (Mess Owners only)
 */
router.post(
  '/',
  authenticate,
  authorizeOwner,
  validateCreateMess,
  messController.createMess
);

/**
 * @route   PUT /api/mess/:id
 * @desc    Update own mess
 * @access  Protected (Mess Owners only)
 */
router.put(
  '/:id',
  authenticate,
  authorizeOwner,
  validateMongoId('id'),
  messController.updateMess
);

/**
 * @route   GET /api/mess/owner/dashboard
 * @desc    Get own messes (owner dashboard)
 * @access  Protected (Mess Owners only)
 */
router.get(
  '/owner/dashboard',
  authenticate,
  authorizeOwner,
  messController.getOwnMesses
);

export default router;