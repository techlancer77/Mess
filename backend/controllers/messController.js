import messService from '../services/messService.js';

/**
 * MESS CONTROLLER
 * Handles HTTP requests for mess operations
 * Delegates ALL business logic to messService
 * NO direct database access
 */

class MessController {
  /**
   * Get all approved messes with filters
   * PUBLIC route
   */
  getAllMesses = async (req, res, next) => {
    try {
      const filters = {
        search: req.query.search,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        isVegOnly: req.query.isVegOnly,
        minRating: req.query.minRating,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await messService.getApprovedMesses(filters);

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Find nearby messes using geolocation
   * PUBLIC route
   */
  getNearbyMesses = async (req, res, next) => {
    try {
      const { longitude, latitude, radius } = req.query;
      const filters = {
        isVegOnly: req.query.isVegOnly,
        minRating: req.query.minRating
      };

      const messes = await messService.findNearbyMesses(
        longitude,
        latitude,
        radius,
        filters
      );

      res.json({
        success: true,
        count: messes.length,
        messes
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get mess by ID (limited data for public)
   * Uses optionalAuth middleware - changes response based on auth
   */
  getMessById = async (req, res, next) => {
    try {
      const mess = await messService.getMessById(
        req.params.id,
        req.isAuthenticated
      );

      res.json({
        success: true,
        mess
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get mess with full contact details
   * PROTECTED route - requires authentication
   */
  getMessWithContact = async (req, res, next) => {
    try {
      const mess = await messService.getMessWithContact(req.params.id);

      res.json({
        success: true,
        mess
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create new mess listing
   * PROTECTED route - mess owners only
   */
  createMess = async (req, res, next) => {
    try {
      const mess = await messService.createMess(req.body, req.userId);

      res.status(201).json({
        success: true,
        message: 'Mess listing submitted for approval',
        mess
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update own mess
   * PROTECTED route - mess owners only
   */
  updateMess = async (req, res, next) => {
    try {
      const mess = await messService.updateMess(
        req.params.id,
        req.userId,
        req.body
      );

      res.json({
        success: true,
        message: 'Mess updated successfully',
        mess
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get own messes (owner dashboard)
   * PROTECTED route - mess owners only
   */
  getOwnMesses = async (req, res, next) => {
    try {
      const messes = await messService.getMessesByOwner(req.userId);

      res.json({
        success: true,
        count: messes.length,
        messes
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new MessController();