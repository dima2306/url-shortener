const {Router} = require('express');
const authController = require('../controllers/authController');
const registerUserRules = require('../validations/UserRegistrationValidation');
const {validationResult} = require('express-validator');

const router = Router();

router.get('/login', authController.createLogin);
router.post('/login', authController.storeLogin);

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

module.exports = router;