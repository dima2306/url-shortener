const { matchedData } = require('express-validator');
const userModel = require('../models/User');
const jwt = require('../services/GenerateJwtToken');

function createLogin(req, res) {
  res.render('layout', {
    content: 'auth/login',
    messages: req.flash('messageBag'),
    isGuest: req.isGuest,
    user: req.user,
  });
}

async function storeLogin(req, res) {
  const data = matchedData(req);

  try {
    const user = await userModel.loginUsingEmail(data.email, data.password);

    res.cookie('jwt', jwt.generateJwtToken(user._id), {
      httpOnly: true,
      maxAge: jwt.maxAge,
    });

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
    });
  } catch (error) {
    console.error('storeLogin error', error);
  }
}

function createRegister(req, res) {
  res.render('layout', {
    content: 'auth/register',
    isGuest: req.isGuest,
    user: req.user,
    errors: [],
    oldInput: {},
  });
}

async function storeRegister(req, res) {
  const data = matchedData(req);
  const user = new userModel(data);

  await user.save();

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

function logOut(req, res) {
  res.clearCookie('jwt');

  res.redirect('/');
}

module.exports = {
  createLogin,
  storeLogin,
  createRegister,
  storeRegister,
  logOut,
};