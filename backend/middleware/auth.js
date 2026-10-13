const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Will create model later

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (without password)
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.error('No token provided in Authorization header');
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

// Role check middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: `Role ${req.user.role} is not authorized` });
    }
    next();
  };
};

module.exports = { protect, authorize };

