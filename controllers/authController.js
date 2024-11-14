const {matchedData} = require('express-validator');

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
  console.log(req.body);

  const data = matchedData(req);

  console.log(data);

  res.send('Registering...');
}

module.exports = {
  createLogin,
  storeLogin,
  createRegister,
  storeRegister,
};