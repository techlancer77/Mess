import { verifyAccessToken } from '../config/jwt.js';
import User from '../models/User.js';
import MessOwner from '../models/MessOwner.js';
import Admin from '../models/Admin.js';

/**
 * JWT AUTHENTICATION MIDDLEWARE
 * Verifies JWT token and attaches user to request
 * Used for protected routes
 */

export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please authenticate.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyAccessToken(token);

    // Get user based on role
    let user;
    if (decoded.role === 'user') {
      user = await User.findById(decoded.id).select('-__v');
    } else if (decoded.role === 'owner') {
      user = await MessOwner.findById(decoded.id).select('-password -__v');
    } else if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password -__v');
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Attach user to request object
    req.user = user;
    req.userId = user._id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

/**
 * Optional authentication
 * Doesn't fail if no token, but attaches user if valid token exists
 * Used for routes that change behavior based on auth status
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      req.isAuthenticated = false;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    let user;
    if (decoded.role === 'user') {
      user = await User.findById(decoded.id).select('-__v');
    } else if (decoded.role === 'owner') {
      user = await MessOwner.findById(decoded.id).select('-password -__v');
    } else if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password -__v');
    }

    if (user && user.isActive) {
      req.user = user;
      req.userId = user._id;
      req.userRole = decoded.role;
      req.isAuthenticated = true;
    } else {
      req.user = null;
      req.isAuthenticated = false;
    }

    next();
  } catch (error) {
    // If token is invalid, continue without auth
    req.user = null;
    req.isAuthenticated = false;
    next();
  }
};