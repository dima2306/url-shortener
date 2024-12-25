const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

const jwtAuthMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    req.flash('messageBag', [
      {
        type: 'error',
        message: 'You need to be logged in to access this page',
      },
    ]);

    return res.redirect('/auth/login');
  }

  try {
    let user;

    if (req.user !== null || typeof req.user !== 'undefined') {
      user = req.user;
    } else {
      const decodedToken = jwt.verify(token, process.env.APP_SESSION_SECRET);
      user = await userModel.findById(decodedToken.id).select('-password');
    }

    if (!user) {
      req.flash('messageBag', [
        {
          type: 'error',
          message: 'User not found',
        },
      ]);

      return res.redirect('/auth/login');
    }

    req.isGuest = false;
    req.user = user;

    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    req.flash('messageBag', [
      {
        type: 'error',
        message: 'Your session has expired. Please log in again',
      },
    ]);

    return res.redirect('/auth/login');
  }
};

module.exports = jwtAuthMiddleware;