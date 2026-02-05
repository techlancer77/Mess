import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import MessOwner from '../models/MessOwner.js';
import Admin from '../models/Admin.js';
import { generateAccessToken, generateRefreshToken } from '../config/jwt.js';

/**
 * AUTH SERVICE
 * Business logic for authentication flows
 * Controllers call these methods – NEVER access models directly
 */

class AuthService {

  // ===============================
  // GOOGLE OAUTH
  // ===============================
  async handleGoogleOAuth(googleProfile) {
    const { id, displayName, emails, photos } = googleProfile;

    const email = emails?.[0]?.value;
    if (!email) {
      throw new Error('Google account has no email');
    }

    const avatar = photos?.[0]?.value || '';

    let user = await User.findOne({ googleId: id });

    if (!user) {
      user = await User.create({
        googleId: id,
        email,
        name: displayName,
        avatar,
        role: 'user',
        isActive: true
      });
    } else {
      user.name = displayName;
      user.avatar = avatar;
      await user.save();
    }

    return user;
  }

  // ===============================
  // JWT TOKENS
  // ===============================
  generateTokens(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload)
    };
  }

  // ===============================
  // GET USER
  // ===============================
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password -__v');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // ===============================
  // MESS OWNER REGISTER
  // ===============================
// FIXED
async registerMessOwner(ownerData) {
  const { email, password, name, phone } = ownerData;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const existingOwner = await MessOwner.findOne({ email });
  if (existingOwner) {
    throw new Error('Email already registered');
  }

  const owner = await MessOwner.create({
    email,
    password, // ✅ PLAIN password
    name,
    phone,
    role: 'owner',
    isActive: true
  });

  return owner;
}


  // ===============================
  // MESS OWNER LOGIN
  // ===============================
  async loginMessOwner(email, password) {
    const owner = await MessOwner.findOne({ email, isActive: true });

    if (!owner) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return owner;
  }

  // ===============================
  // ADMIN LOGIN
  // ===============================
  async loginAdmin(email, password) {
    const admin = await Admin.findOne({ email, isActive: true });

    if (!admin) {
      throw new Error('Invalid admin credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error('Invalid admin credentials');
    }

    return admin;
  }

  // ===============================
  // DEFAULT ADMIN SEEDING (FIXED)
  // ===============================
// ===============================
// DEFAULT ADMIN SEEDING (FIXED)
// ===============================
async createDefaultAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set. Skipping admin creation.');
    return null;
  }

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (existingAdmin) {
    return existingAdmin;
  }

  // ✅ DO NOT HASH HERE
  const admin = await Admin.create({
    email: adminEmail,
    password: adminPassword, // ✅ plain password
    name: 'System Admin',
    role: 'admin',
    isActive: true
  });

  console.log('✅ Default admin created');

  return admin;
}

}

export default new AuthService();
