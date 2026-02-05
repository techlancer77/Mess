import adminService from '../services/adminService.js';
import reviewService from '../services/reviewService.js';

/**
 * ADMIN CONTROLLER
 * Handles HTTP requests for admin operations
 * Delegates ALL business logic to adminService
 * NO direct database access
 */

class AdminController {
  /**
   * Get all pending messes for approval
   * ADMIN route only
   */
  getPendingMesses = async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await adminService.getPendingMesses(page, limit);

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all messes (any status)
   * ADMIN route only
   */
  getAllMesses = async (req, res, next) => {
    try {
      const filters = {
        status: req.query.status,
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await adminService.getAllMesses(filters);

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Approve a mess
   * ADMIN route only
   */
  approveMess = async (req, res, next) => {
    try {
      const mess = await adminService.approveMess(req.params.id, req.userId);

      res.json({
        success: true,
        message: 'Mess approved successfully',
        mess
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reject a mess
   * ADMIN route only
   */
  rejectMess = async (req, res, next) => {
    try {
      const { reason } = req.body;
      const mess = await adminService.rejectMess(req.params.id, req.userId, reason);

      res.json({
        success: true,
        message: 'Mess rejected',
        mess
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Suspend a mess
   * ADMIN route only
   */
  suspendMess = async (req, res, next) => {
    try {
      const { reason } = req.body;
      const mess = await adminService.suspendMess(req.params.id, req.userId, reason);

      res.json({
        success: true,
        message: 'Mess suspended',
        mess
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reactivate a mess
   * ADMIN route only
   */
  reactivateMess = async (req, res, next) => {
    try {
      const mess = await adminService.reactivateMess(req.params.id, req.userId);

      res.json({
        success: true,
        message: 'Mess reactivated',
        mess
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all pending reviews
   * ADMIN route only
   */
  getPendingReviews = async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await reviewService.getPendingReviews(page, limit);

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Approve a review
   * ADMIN route only
   */
  approveReview = async (req, res, next) => {
    try {
      const review = await reviewService.approveReview(req.params.id, req.userId);

      res.json({
        success: true,
        message: 'Review approved',
        review
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a review
   * ADMIN route only
   */
  deleteReview = async (req, res, next) => {
    try {
      const result = await reviewService.deleteReviewByAdmin(req.params.id, req.userId);

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get platform statistics
   * ADMIN route only
   */
  getStats = async (req, res, next) => {
    try {
      const stats = await adminService.getPlatformStats();

      res.json({
        success: true,
        stats
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AdminController();