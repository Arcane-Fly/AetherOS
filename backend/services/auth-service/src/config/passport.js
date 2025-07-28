const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { findUserByProvider, createOAuthUser } = require('../models/User');
const logger = require('./logger');

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserByProvider('local', id);
    done(null, user);
  } catch (error) {
    logger.error('Error deserializing user', { error: error.message, userId: id });
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    logger.info('Google OAuth authentication attempt', { 
      googleId: profile.id,
      email: profile.emails[0]?.value 
    });

    // Check if user already exists
    let user = await findUserByProvider('google', profile.id);
    
    if (!user) {
      // Create new user
      const userData = {
        email: profile.emails[0]?.value,
        name: profile.displayName,
        provider: 'google',
        providerId: profile.id,
        avatar: profile.photos[0]?.value,
        accessToken,
        refreshToken
      };
      
      user = await createOAuthUser(userData);
      logger.info('New Google user created', { userId: user.id, email: user.email });
    } else {
      logger.info('Existing Google user authenticated', { userId: user.id, email: user.email });
    }
    
    return done(null, user);
  } catch (error) {
    logger.error('Google OAuth error', { error: error.message, googleId: profile.id });
    return done(error, null);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    logger.info('GitHub OAuth authentication attempt', { 
      githubId: profile.id,
      username: profile.username 
    });

    // Check if user already exists
    let user = await findUserByProvider('github', profile.id);
    
    if (!user) {
      // Create new user
      const userData = {
        email: profile.emails?.[0]?.value || `${profile.username}@github.local`,
        name: profile.displayName || profile.username,
        provider: 'github',
        providerId: profile.id,
        avatar: profile.photos[0]?.value,
        accessToken,
        refreshToken
      };
      
      user = await createOAuthUser(userData);
      logger.info('New GitHub user created', { userId: user.id, email: user.email });
    } else {
      logger.info('Existing GitHub user authenticated', { userId: user.id, email: user.email });
    }
    
    return done(null, user);
  } catch (error) {
    logger.error('GitHub OAuth error', { error: error.message, githubId: profile.id });
    return done(error, null);
  }
}));

module.exports = passport;