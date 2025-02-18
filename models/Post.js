'use strict'

const mongoose = require('mongoose')
const { slugify } = require('../helpers/helper');

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
  slug: {
    type: String,
    required: true,
    unique: true,
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

postSchema.pre('validate', function(next) {
  this.slug = slugify(this.title);

  next();
});

postSchema.statics.getAllRecords = async function() {
  try {
    return await this.find().sort({ createdAt: -1 });
  } catch (error) {
    console.log('postSchema.statics.getAllRecords', error);
    throw new Error(error);
  }
};

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
