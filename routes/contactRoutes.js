'use strict';

const { Router } = require('express');
const { validationResult } = require('express-validator');
const ContactController = require('../controllers/ContactController');
const contactRules = require('../validations/ContactValidation');

const router = Router();

router.get('/', (req, res) => {
  res.render('layout', {
    content: 'contact',
    isGuest: req.isGuest,
    user: req.user,
    errors: [],
    oldInput: {},
  });
});

router.post('/', contactRules, (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('layout', {
      content: 'contact',
      isGuest: req.isGuest,
      user: req.user,
      errors: errors.array(),
      oldInput: req.body,
    }, function(err, html) {
      res.status(422).send(html);
    });
  }

  next();
}, ContactController.storeContact);

module.exports = router;
