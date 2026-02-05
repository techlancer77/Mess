import authService from '../services/authService.js';
import passport from 'passport';

/**
 * AUTH CONTROLLER
 * Handles HTTP requests and responses
 * Delegates ALL business logic to authService
 * NO direct database access
 */

class AuthController {
  /**
   * Initiate Google OAuth flow
   * Redirects to Google consent screen
   */
  googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email']
  });

  /**
   * Google OAuth callback
   * Exchanges code for tokens and creates JWT
   */
  googleCallback = async (req, res, next) => {
    passport.authenticate('google', { session: false }, async (err, user) => {
      try {
        if (err || !user) {
          return res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
        }

        // Generate JWT tokens (service layer)
        const { accessToken, refreshToken } = authService.generateTokens(user);

        // Redirect to frontend with tokens
        res.redirect(
          `${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}&refresh=${refreshToken}`
        );
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  };

  /**
   * Get current authenticated user
   */
  getCurrentUser = async (req, res, next) => {
    try {
      // req.user is already attached by auth middleware
      res.json({
        success: true,
        user: req.user
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mess Owner Registration
   */
  registerOwner = async (req, res, next) => {
    try {
      const owner = await authService.registerMessOwner(req.body);

      // Generate tokens
      const { accessToken, refreshToken } = authService.generateTokens(owner);

      res.status(201).json({
        success: true,
        message: 'Mess owner registered successfully',
        user: {
          id: owner._id,
          email: owner.email,
          name: owner.name,
          role: owner.role
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mess Owner Login
   */
  loginOwner = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const owner = await authService.loginMessOwner(email, password);

      // Generate tokens
      const { accessToken, refreshToken } = authService.generateTokens(owner);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: owner._id,
          email: owner.email,
          name: owner.name,
          role: owner.role
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Admin Login
   */
  loginAdmin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const admin = await authService.loginAdmin(email, password);

      // Generate tokens
      const { accessToken, refreshToken } = authService.generateTokens(admin);

      res.json({
        success: true,
        message: 'Admin login successful',
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout (client-side token deletion)
   */
  logout = (req, res) => {
    res.json({
      success: true,
      message: 'Logged out successfully. Please delete tokens from client.'
    });
  };
}

export default new AuthController();