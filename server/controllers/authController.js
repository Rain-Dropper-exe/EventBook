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

exports.adminLogin = (req, res, next) => {
  const { username, password } = req.body;
  if (username === 'adminuser' && password === 'adminpass') {
    const adminUser = {
      id: '000000000000000000000000',
      name: 'Admin Reviewer',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=2563eb&color=fff',
      role: 'admin'
    };
    const token = jwt.sign(
      { id: adminUser.id, email: 'admin@eventbook.com', role: adminUser.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiry }
    );
    return res.json({ success: true, token, user: adminUser });
  }
  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
};

exports.getMe = async (req, res, next) => {
  try {
    if (req.user.id === '000000000000000000000000') {
      return res.json({ success: true, data: {
        _id: req.user.id,
        name: 'Admin Reviewer',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=2563eb&color=fff',
        role: 'admin'
      }});
    }
    const user = await User.findById(req.user.id).select('-googleId');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
