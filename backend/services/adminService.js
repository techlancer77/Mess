import Mess from '../models/Mess.js';
import Review from '../models/Review.js';
import messService from './messService.js';

/**
 * ADMIN SERVICE
 * Business logic for admin operations
 * Mess approval, review moderation
 */

class AdminService {
  /**
   * Get all pending messes
   */
  async getPendingMesses(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const messes = await Mess.find({ status: 'pending' })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await Mess.countDocuments({ status: 'pending' });

    return {
      messes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    };
  }

  /**
   * Get all messes (any status) for admin
   */
  async getAllMesses(filters = {}) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
      query.status = status;
    }

    const messes = await Mess.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await Mess.countDocuments(query);

    return {
      messes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    };
  }

  /**
   * Approve mess
   */
  async approveMess(messId, adminId) {
    const mess = await Mess.findById(messId);

    if (!mess) {
      throw new Error('Mess not found');
    }

    if (mess.status !== 'pending') {
      throw new Error('Only pending messes can be approved');
    }

    mess.status = 'approved';
    mess.approvedBy = adminId;
    mess.approvedAt = new Date();
    await mess.save();

    return mess;
  }

  /**
   * Reject mess with reason
   */
  async rejectMess(messId, adminId, reason) {
    const mess = await Mess.findById(messId);

    if (!mess) {
      throw new Error('Mess not found');
    }

    if (mess.status !== 'pending') {
      throw new Error('Only pending messes can be rejected');
    }

    mess.status = 'rejected';
    mess.rejectionReason = reason;
    mess.approvedBy = adminId;
    await mess.save();

    return mess;
  }

  /**
   * Suspend approved mess
   */
  async suspendMess(messId, adminId, reason) {
    const mess = await Mess.findById(messId);

    if (!mess) {
      throw new Error('Mess not found');
    }

    if (mess.status !== 'approved') {
      throw new Error('Only approved messes can be suspended');
    }

    mess.status = 'suspended';
    mess.rejectionReason = reason;
    await mess.save();

    return mess;
  }

  /**
   * Reactivate suspended mess
   */
  async reactivateMess(messId, adminId) {
    const mess = await Mess.findById(messId);

    if (!mess) {
      throw new Error('Mess not found');
    }

    if (mess.status !== 'suspended' && mess.status !== 'rejected') {
      throw new Error('Only suspended/rejected messes can be reactivated');
    }

    mess.status = 'approved';
    mess.rejectionReason = null;
    mess.approvedBy = adminId;
    mess.approvedAt = new Date();
    await mess.save();

    return mess;
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats() {
    const stats = await Promise.all([
      Mess.countDocuments({ status: 'approved' }),
      Mess.countDocuments({ status: 'pending' }),
      Mess.countDocuments({ status: 'rejected' }),
      Mess.countDocuments({ status: 'suspended' }),
      Review.countDocuments({ isApproved: true }),
      Review.countDocuments({ isApproved: false })
    ]);

    return {
      approvedMesses: stats[0],
      pendingMesses: stats[1],
      rejectedMesses: stats[2],
      suspendedMesses: stats[3],
      approvedReviews: stats[4],
      pendingReviews: stats[5],
      totalMesses: stats[0] + stats[1] + stats[2] + stats[3],
      totalReviews: stats[4] + stats[5]
    };
  }
}

export default new AdminService();