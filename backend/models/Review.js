import mongoose from 'mongoose';

/**
 * REVIEW MODEL
 * Schema Only - NO business logic
 * One review per user per mess
 */

const reviewSchema = new mongoose.Schema({
  mess: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mess',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  // Admin moderation
  isApproved: {
    type: Boolean,
    default: false
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  moderatedAt: Date
}, {
  timestamps: true
});

// Ensure one review per user per mess
reviewSchema.index({ mess: 1, user: 1 }, { unique: true });

// Index for querying approved reviews
reviewSchema.index({ mess: 1, isApproved: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;