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

function show() {

}

module.exports = {
  index,
  show,
};