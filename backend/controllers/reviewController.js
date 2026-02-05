import reviewService from '../services/reviewService.js';

/**
 * REVIEW CONTROLLER
 * Handles HTTP requests for review operations
 * Delegates ALL business logic to reviewService
 * NO direct database access
 */

class ReviewController {
  /**
   * Create a new review
   * PROTECTED route - authenticated users only
   */
  createReview = async (req, res, next) => {
    try {
      const review = await reviewService.createReview(req.body, req.userId);

      res.status(201).json({
        success: true,
        message: 'Review submitted for approval',
        review
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get approved reviews for a mess
   * PUBLIC route
   */
  getReviewsByMess = async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const result = await reviewService.getReviewsByMess(
        req.params.messId,
        page,
        limit
      );

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update own review
   * PROTECTED route - users can only update their own reviews
   */
  updateReview = async (req, res, next) => {
    try {
      const review = await reviewService.updateReview(
        req.params.id,
        req.userId,
        req.body
      );

      res.json({
        success: true,
        message: 'Review updated and submitted for re-approval',
        review
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete own review
   * PROTECTED route - users can only delete their own reviews
   */
  deleteReview = async (req, res, next) => {
    try {
      const result = await reviewService.deleteReview(req.params.id, req.userId);

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ReviewController();