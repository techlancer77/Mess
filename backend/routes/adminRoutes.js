import express from 'express';
import adminController from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeAdmin } from '../middleware/roleAuth.js';
import { validateMongoId } from '../middleware/validator.js';

/**
 * ADMIN ROUTES
 * Defines admin-only endpoints
 * NO business logic - just routing
 * All routes require admin authentication
 */

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorizeAdmin);

// ============================================
// MESS MANAGEMENT ROUTES
// ============================================

/**
 * @route   GET /api/admin/messes/pending
 * @desc    Get all pending messes
 * @access  Admin only
 */
router.get('/messes/pending', adminController.getPendingMesses);

/**
 * @route   GET /api/admin/messes
 * @desc    Get all messes (any status)
 * @access  Admin only
 */
router.get('/messes', adminController.getAllMesses);

/**
 * @route   PUT /api/admin/messes/:id/approve
 * @desc    Approve a mess
 * @access  Admin only
 */
router.put(
  '/messes/:id/approve',
  validateMongoId('id'),
  adminController.approveMess
);

/**
 * @route   PUT /api/admin/messes/:id/reject
 * @desc    Reject a mess
 * @access  Admin only
 */
router.put(
  '/messes/:id/reject',
  validateMongoId('id'),
  adminController.rejectMess
);

/**
 * @route   PUT /api/admin/messes/:id/suspend
 * @desc    Suspend a mess
 * @access  Admin only
 */
router.put(
  '/messes/:id/suspend',
  validateMongoId('id'),
  adminController.suspendMess
);

/**
 * @route   PUT /api/admin/messes/:id/reactivate
 * @desc    Reactivate a suspended mess
 * @access  Admin only
 */
router.put(
  '/messes/:id/reactivate',
  validateMongoId('id'),
  adminController.reactivateMess
);

// ============================================
// REVIEW MODERATION ROUTES
// ============================================

/**
 * @route   GET /api/admin/reviews/pending
 * @desc    Get all pending reviews
 * @access  Admin only
 */
router.get('/reviews/pending', adminController.getPendingReviews);

/**
 * @route   PUT /api/admin/reviews/:id/approve
 * @desc    Approve a review
 * @access  Admin only
 */
router.put(
  '/reviews/:id/approve',
  validateMongoId('id'),
  adminController.approveReview
);

/**
 * @route   DELETE /api/admin/reviews/:id
 * @desc    Delete a review
 * @access  Admin only
 */
router.delete(
  '/reviews/:id',
  validateMongoId('id'),
  adminController.deleteReview
);

// ============================================
// STATISTICS ROUTES
// ============================================

/**
 * @route   GET /api/admin/stats
 * @desc    Get platform statistics
 * @access  Admin only
 */
router.get('/stats', adminController.getStats);

export default router;