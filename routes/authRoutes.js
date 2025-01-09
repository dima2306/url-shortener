'use strict';

const { Router } = require('express');
const authController = require('../controllers/AuthController');
const registerUserRules = require('../validations/UserRegistrationValidation');
const authUserRules = require('../validations/UserAuthenticationValidation');
const { validationResult } = require('express-validator');
const multer = require('multer');

const router = Router();
const upload = multer();

router.get('/login', authController.createLogin);
// We need to pass the multer upload.none() middleware to the route handler
// because the authUserRules middleware expects the request body to be
// parsed as form data, and we use FormData on the frontend.
router.post('/login', upload.none(), authUserRules, (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).send({ errors: errors.array() });
  }

  next();
}, authController.storeLogin);

router.get('/register', authController.createRegister);
router.post('/register', registerUserRules, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('layout', {
      content: 'auth/register',
      errors: errors.array(),
      oldInput: req.body,
    }, function(err, html) {
      res.status(422).send(html);
    });
  }
  next();
}, authController.storeRegister);

router.get('/logout', authController.logOut);

module.exports = router;