const { body } = require('express-validator');

const contactRules = [
    body('name')
        .escape().trim()
        .notEmpty().withMessage('Name is required.')
        .bail()
        .isLength({ min: 3 }).withMessage('Name should be at least 3 characters.'),
    body('email')
        .escape().trim()
        .normalizeEmail()
        .notEmpty().withMessage('Email is required.')
        .bail()
        .isEmail().withMessage('Invalid email address.'),
    body('message')
        .escape().trim()
        .notEmpty().withMessage('Message is required.')
        .bail()
        .isLength({ min: 10 }).withMessage('Message should be at least 10 characters.'),
];

module.exports = contactRules;