'use strict';

const jwt = require('jsonwebtoken');

const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in seconds

const generateJwtToken = id => {
  if (id === null || id === undefined) {
    throw new Error('Invalid user ID');
  }

  if (!process.env.APP_SESSION_SECRET) {
    throw new Error('APP_SESSION_SECRET environment variable is not set');
  }

  return jwt.sign({id}, process.env.APP_SESSION_SECRET, {
    expiresIn: maxAge,
  });
}

module.exports = {
  maxAge,
  generateJwtToken,
};
