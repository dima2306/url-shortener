'use strict'

const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  cover: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  content: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 500,
  },
}, { timestamps: true });

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
