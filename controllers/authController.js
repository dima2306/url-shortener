const {matchedData} = require('express-validator');
const userModel = require('../models/User');
const jwt = require('../services/GenerateJwtToken');

function createLogin(req, res) {
  res.render('layout', {content: 'auth/login'});
}

function storeLogin(req, res) {
  const data = matchedData(req);

  res.json({response: 'Logging in...'});
}

function createRegister(req, res) {
  res.render('layout', {
    content: 'auth/register',
    errors: [],
    oldInput: {},
  });
}

function storeRegister(req, res) {
  const data = matchedData(req);
  const user = new userModel(data);

  user.save();

  res.cookie('jwt', jwt.generateJwtToken(user._id), {
    httpOnly: true,
    maxAge: jwt.maxAge,
  });

  req.flash('messageBag', [
    {
      type: 'success',
      message: 'User registered successfully',
    },
  ]);

  res.redirect('/');
}

module.exports = {
  createLogin,
  storeLogin,
  createRegister,
  storeRegister,
};