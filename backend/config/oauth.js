import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

/**
 * Google OAuth 2.0 Configuration
 * Using Passport.js for OAuth flow
 */

const configureGoogleOAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user info from Google profile
          const { id, displayName, emails, photos } = profile;
          const email = emails[0].value;
          const avatar = photos[0]?.value || '';

          // Check if user exists
          let user = await User.findOne({ googleId: id });

          if (!user) {
            // Create new user
            user = await User.create({
              googleId: id,
              email,
              name: displayName,
              avatar,
              role: 'user'
            });
          } else {
            // Update existing user info
            user.name = displayName;
            user.avatar = avatar;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize user for session (not used in JWT but required by Passport)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configureGoogleOAuth;