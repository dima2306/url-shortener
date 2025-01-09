'use strict';

const User = require('../models/User');

async function index(req, res) {
  const user = await User.findById(req.user._id);
  await user.populate('urls');

  res.render('layout', {
    content: 'profile',
    messages: req.flash('messageBag'),
    isGuest: req.isGuest,
    user: user,
  });
}

module.exports = {
  index,
};