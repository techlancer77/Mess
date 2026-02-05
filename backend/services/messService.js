import Mess from '../models/Mess.js';
import Review from '../models/Review.js';

/**
 * MESS SERVICE
 * Business logic for mess operations
 * Includes geolocation queries, filtering, and CRUD
 */

class MessService {
  /**
   * Get all approved messes with optional filters
   */
  async getApprovedMesses(filters = {}) {
    const {
      search,
      minPrice,
      maxPrice,
      isVegOnly,
      minRating,
      sortBy = 'averageRating',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = filters;

    const query = { status: 'approved' };

    // Apply filters
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query['priceRange.min'] = {};
      if (minPrice) query['priceRange.min'].$gte = Number(minPrice);
      if (maxPrice) query['priceRange.max'] = { $lte: Number(maxPrice) };
    }

    if (isVegOnly === 'true' || isVegOnly === true) {
      query.isVegOnly = true;
    }

    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const messes = await Mess.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v')
      .populate('owner', 'name email phone');

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
   * Find nearby messes using geolocation
   * MongoDB $geoNear for proximity search
   */
  async findNearbyMesses(longitude, latitude, radiusInKm = 5, filters = {}) {
    const radiusInMeters = radiusInKm * 1000;

    const query = {
      status: 'approved',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)]
          },
          $maxDistance: radiusInMeters
        }
      }
    };

    // Apply additional filters
    if (filters.isVegOnly === 'true' || filters.isVegOnly === true) {
      query.isVegOnly = true;
    }

    if (filters.minRating) {
      query.averageRating = { $gte: Number(filters.minRating) };
    }

    const messes = await Mess.find(query)
      .limit(20)
      .select('-__v')
      .populate('owner', 'name email phone');

    return messes;
  }

  /**
   * Get mess by ID (public view - limited data)
   */
  async getMessById(messId, isAuthenticated = false) {
    const mess = await Mess.findById(messId)
      .populate('owner', 'name email');

    if (!mess) {
      throw new Error('Mess not found');
    }

    if (mess.status !== 'approved') {
      throw new Error('Mess not available');
    }

    // Hide contact details for unauthenticated users
    const messData = mess.toObject();
    if (!isAuthenticated) {
      delete messData.contactPhone;
      delete messData.contactEmail;
    }

    return messData;
  }

  /**
   * Get mess with full contact details (authenticated users only)
   */
  async getMessWithContact(messId) {
    const mess = await Mess.findById(messId)
      .populate('owner', 'name email phone');

    if (!mess) {
      throw new Error('Mess not found');
    }

    if (mess.status !== 'approved') {
      throw new Error('Mess not available');
    }

    return mess;
  }

  /**
   * Create new mess listing (by mess owner)
   */
  async createMess(messData, ownerId) {
    const mess = await Mess.create({
      ...messData,
      owner: ownerId,
      status: 'pending'
    });

    return mess;
  }

  /**
   * Update mess (by owner)
   */
  async updateMess(messId, ownerId, updates) {
    const mess = await Mess.findOne({ _id: messId, owner: ownerId });

    if (!mess) {
      throw new Error('Mess not found or unauthorized');
    }

    // Owners cannot change status
    delete updates.status;
    delete updates.approvedAt;
    delete updates.approvedBy;

    Object.assign(mess, updates);
    await mess.save();

    return mess;
  }

  /**
   * Get all messes by owner
   */
  async getMessesByOwner(ownerId) {
    const messes = await Mess.find({ owner: ownerId })
      .sort({ createdAt: -1 })
      .select('-__v');

    return messes;
  }

  /**
   * Calculate and update mess ratings
   * Called after review approval/deletion
   */
  async updateMessRating(messId) {
    const reviews = await Review.find({ mess: messId, isApproved: true });

    if (reviews.length === 0) {
      await Mess.findByIdAndUpdate(messId, {
        averageRating: 0,
        totalReviews: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Mess.findByIdAndUpdate(messId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length
    });
  }
}

export default new MessService();