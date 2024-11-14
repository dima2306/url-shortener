const {body} = require('express-validator');

const registerUserRules = [
  body('name')
    .escape().trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({min: 3, max: 30}).withMessage('Name is too short.'),

  body('surname')
    .escape().trim()
    .notEmpty().withMessage('Surname is required.')
    .isLength({min: 4, max: 40}).withMessage('Surname is too short.'),

  body('email')
    .escape().trim()
    .normalizeEmail()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email address.'),

  body('password')
    .escape().trim()
    .notEmpty().withMessage('Password is required.')
    .isLength({min: 8}).withMessage('Password is too short.'),

  body('terms')
    .equals('on')
    .withMessage('You must agree to the terms and conditions.'),

];

module.exports = registerUserRules;