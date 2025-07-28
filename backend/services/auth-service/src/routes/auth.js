const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const passport = require('../config/passport');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// OAuth routes - only if configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  }));

  router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    authController.oauthCallback
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  router.get('/github', passport.authenticate('github', { 
    scope: ['user:email'] 
  }));

  router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    authController.oauthCallback
  );
}

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/refresh', authMiddleware, authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;