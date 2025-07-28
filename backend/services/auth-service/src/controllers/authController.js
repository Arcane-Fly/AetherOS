const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User } = require('../models/User');
const logger = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-change-this-in-production';
const JWT_EXPIRE = '24h';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(100).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

class AuthController {
  async register(req, res) {
    try {
      // Validate input
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        req.logger?.warn('Registration validation failed', { error: error.details[0].message });
        return res.status(400).json({ error: error.details[0].message });
      }

      const { email, password, name } = value;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        req.logger?.warn('Registration attempted with existing email', { email });
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await User.create(email, passwordHash, name);

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      req.logger?.info('User registered successfully', { userId: newUser.id, email: newUser.email });

      res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        }
      });
    } catch (error) {
      req.logger?.error('Registration error', { error: error.message });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req, res) {
    try {
      // Validate input
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        req.logger?.warn('Login validation failed', { error: error.details[0].message });
        return res.status(400).json({ error: error.details[0].message });
      }

      const { email, password } = value;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        req.logger?.warn('Login attempted with non-existent email', { email });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        req.logger?.warn('Login attempted with invalid password', { email });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await User.updateLastLogin(user.id);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      req.logger?.info('User logged in successfully', { userId: user.id, email: user.email });

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      req.logger?.error('Login error', { error: error.message });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async oauthCallback(req, res) {
    try {
      if (!req.user) {
        req.logger?.warn('OAuth callback without user data');
        return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
      }

      // Update last login
      await User.updateLastLogin(req.user.id);

      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user.id, email: req.user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      req.logger?.info('OAuth login successful', { 
        userId: req.user.id, 
        email: req.user.email,
        provider: req.user.provider 
      });

      // Redirect to frontend with token
      res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
    } catch (error) {
      req.logger?.error('OAuth callback error', { error: error.message });
      res.redirect(`${FRONTEND_URL}/login?error=oauth_error`);
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        req.logger?.warn('Profile requested for non-existent user', { userId: req.user.userId });
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          provider: user.provider,
          avatar: user.avatar,
          created_at: user.created_at
        }
      });
    } catch (error) {
      req.logger?.error('Get profile error', { error: error.message });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateProfile(req, res) {
    try {
      const { name } = req.body;
      
      if (!name || name.trim().length < 2) {
        req.logger?.warn('Profile update with invalid name', { userId: req.user.userId });
        return res.status(400).json({ error: 'Name is required and must be at least 2 characters' });
      }

      const updatedUser = await User.updateById(req.user.userId, { name: name.trim() });
      
      req.logger?.info('Profile updated successfully', { userId: req.user.userId });

      res.json({
        success: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          updated_at: updatedUser.updated_at
        }
      });
    } catch (error) {
      req.logger?.error('Update profile error', { error: error.message });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async refreshToken(req, res) {
    try {
      // Generate new token
      const token = jwt.sign(
        { userId: req.user.userId, email: req.user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      req.logger?.info('Token refreshed', { userId: req.user.userId });

      res.json({
        success: true,
        token
      });
    } catch (error) {
      req.logger?.error('Refresh token error', { error: error.message });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async logout(req, res) {
    try {
      req.logger?.info('User logged out', { userId: req.user.userId });
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      req.logger?.error('Logout error', { error: error.message });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AuthController();