const {matchedData} = require('express-validator');
const userModel = require('../models/User');

function createLogin(req, res) {
  res.render('layout', {content: 'auth/login'});
}

function storeLogin(req, res) {
  const {email, password, remember} = req.body;

  console.log(email, password, remember);
  res.send('Logging in...');
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

  res.redirect(201, '/');
}

module.exports = {
  createLogin,
  storeLogin,
  createRegister,
  storeRegister,
};