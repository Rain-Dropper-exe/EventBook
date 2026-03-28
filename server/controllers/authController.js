const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

exports.googleCallback = (req, res, next) => {
  try {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiry }
    );
    
    const userString = JSON.stringify({
      id: req.user._id,
      name: req.user.name,
      avatar: req.user.avatar,
      role: req.user.role
    });

    res.redirect(`${config.clientUrl}/auth/callback?token=${token}&user=${userString}`);
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-googleId');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
