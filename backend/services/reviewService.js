import Review from '../models/Review.js';
import Mess from '../models/Mess.js';
import messService from './messService.js';

/**
 * REVIEW SERVICE
 * Business logic for review operations
 * Enforces one review per user per mess
 */

class ReviewService {
  /**
   * Create a new review
   * Validates: mess exists, user hasn't reviewed before
   */
  async createReview(reviewData, userId) {
    const { messId, rating, comment } = reviewData;

    // Check if mess exists and is approved
    const mess = await Mess.findOne({ _id: messId, status: 'approved' });
    if (!mess) {
      throw new Error('Mess not found or not approved');
    }

    // Check if user already reviewed this mess
    const existingReview = await Review.findOne({ mess: messId, user: userId });
    if (existingReview) {
      throw new Error('You have already reviewed this mess');
    }

    // Create review (pending approval)
    const review = await Review.create({
      mess: messId,
      user: userId,
      rating,
      comment,
      isApproved: false
    });

    return review;
  }

  /**
   * Get approved reviews for a mess
   */
  async getReviewsByMess(messId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ mess: messId, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await Review.countDocuments({ mess: messId, isApproved: true });

    return {
      reviews,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    };
  }

  /**
   * Update user's own review
   */
  async updateReview(reviewId, userId, updates) {
    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      throw new Error('Review not found or unauthorized');
    }

    // Reset approval status when review is updated
    review.rating = updates.rating || review.rating;
    review.comment = updates.comment || review.comment;
    review.isApproved = false; // Requires re-approval
    review.moderatedBy = null;
    review.moderatedAt = null;

    await review.save();

    return review;
  }

  /**
   * Delete user's own review
   */
  async deleteReview(reviewId, userId) {
    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      throw new Error('Review not found or unauthorized');
    }

    const messId = review.mess;
    await review.deleteOne();

    // Update mess rating after deletion
    await messService.updateMessRating(messId);

    return { message: 'Review deleted successfully' };
  }

  /**
   * Get all pending reviews (for admin)
   */
  async getPendingReviews(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ isApproved: false })
      .populate('user', 'name email avatar')
      .populate('mess', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await Review.countDocuments({ isApproved: false });

    return {
      reviews,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    };
  }

  /**
   * Approve review (admin only)
   */
  async approveReview(reviewId, adminId) {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    review.isApproved = true;
    review.moderatedBy = adminId;
    review.moderatedAt = new Date();
    await review.save();

    // Update mess rating
    await messService.updateMessRating(review.mess);

    return review;
  }

  /**
   * Delete review (admin only)
   */
  async deleteReviewByAdmin(reviewId, adminId) {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    const messId = review.mess;
    await review.deleteOne();

    // Update mess rating
    await messService.updateMessRating(messId);

    return { message: 'Review deleted by admin' };
  }
}

export default new ReviewService();