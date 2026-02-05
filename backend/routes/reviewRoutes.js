import express from 'express';
import reviewController from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeUser } from '../middleware/roleAuth.js';
import {
  validateCreateReview,
  validateUpdateReview,
  validateMongoId
} from '../middleware/validator.js';

/**
 * REVIEW ROUTES
 * Defines review-related endpoints
 * NO business logic - just routing
 */

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   GET /api/reviews/mess/:messId
 * @desc    Get approved reviews for a mess
 * @access  Public
 */
router.get(
  '/mess/:messId',
  validateMongoId('messId'),
  reviewController.getReviewsByMess
);

// ============================================
// PROTECTED ROUTES (Authenticated Users Only)
// ============================================

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Protected (Users only)
 */
router.post(
  '/',
  authenticate,
  authorizeUser,
  validateCreateReview,
  reviewController.createReview
);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update own review
 * @access  Protected (Users only)
 */
router.put(
  '/:id',
  authenticate,
  authorizeUser,
  validateMongoId('id'),
  validateUpdateReview,
  reviewController.updateReview
);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete own review
 * @access  Protected (Users only)
 */
router.delete(
  '/:id',
  authenticate,
  authorizeUser,
  validateMongoId('id'),
  reviewController.deleteReview
);

export default router;