const {body} = require('express-validator');

const authenticationUserRules = [
  body('email')
    .escape().trim()
    .normalizeEmail()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email address.'),

  body('password')
    .escape().trim()
    .notEmpty().withMessage('Password is required.')
    .isLength({min: 8}).withMessage('Password is too short.'),

];

module.exports = authenticationUserRules;
