/**
 * ROLE-BASED AUTHORIZATION MIDDLEWARE
 * Checks if authenticated user has required role
 * Must be used AFTER authenticate middleware
 */

/**
 * Authorize specific roles
 * Usage: authorize('user', 'admin')
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
};

/**
 * User-only routes
 */
export const authorizeUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.userRole !== 'user') {
    return res.status(403).json({
      success: false,
      message: 'This action is only available to registered users'
    });
  }

  next();
};

/**
 * Mess Owner-only routes
 */
export const authorizeOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.userRole !== 'owner') {
    return res.status(403).json({
      success: false,
      message: 'This action is only available to mess owners'
    });
  }

  next();
};

/**
 * Admin-only routes
 */
export const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

/**
 * Owner or Admin (for management routes)
 */
export const authorizeOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.userRole !== 'owner' && req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Owner or Admin access required'
    });
  }

  next();
};