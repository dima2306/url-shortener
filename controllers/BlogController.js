'use strict';

const PostModel = require('../models/Post');

async function index(req, res) {
  const posts = await PostModel.getAllRecords();

  res.render('layout', {
    content: 'blog/index',
    messages: req.flash('messageBag'),
    isGuest: req.isGuest,
    user: req.user?._id,
    posts,
  });
}

async function show(req, res) {
  const post = await PostModel.findOne({ slug: req.params.slug});

  if (! post) {
    return res.render('layout', {
      content: '404',
      messages: [],
      isGuest: req.isGuest,
      user: req.user?._id,
    });
  }

  res.render('layout', {
    content: 'blog/show',
    messages: [],
    isGuest: req.isGuest,
    user: req.user?._id,
    post,
  });
}

module.exports = {
  index,
  show,
};