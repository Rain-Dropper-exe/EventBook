const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ message: 'Token verification failed, access denied' });
    }

    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = auth;
