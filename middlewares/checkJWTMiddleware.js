const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

const checkJWTMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt ?? req.headers['authorization']?.split(' ')[1];

  req.isGuest = true;
  req.user = null;

  if (!token) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.APP_SESSION_SECRET);
    const user = await userModel.findById(decodedToken.id).select('-password');

    req.isGuest = false;
    req.user = user;

    next();
  } catch (error) {
    console.error('requestMiddleware: JWT verification error:', error);
    next();
  }
};

module.exports = checkJWTMiddleware;