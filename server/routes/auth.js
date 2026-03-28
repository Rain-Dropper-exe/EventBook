const express = require('express');
const passport = require('passport');
const authMiddleware = require('../middleware/auth');
const { googleCallback, getMe } = require('../controllers/authController');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

router.get('/me', authMiddleware, getMe);

module.exports = router;
