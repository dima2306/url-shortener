const mongoose = require('mongoose');
const { isURL } = require('validator');

const urlSchema = new mongoose.Schema({
  // Define the user field as a reference to the User model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  originalUrl: {
    type: String,
    required: [true, 'URL is required'],
    validate: {
      validator: value => isURL(value),
      message: 'Invalid URL format',
    },
  },
  shortenedUrl: {
    type: String,
    required: [true, 'Shortened URL is required'],
    unique: true,
    index: true,
  },
  visibility: {
    type: Boolean,
    required: false,
    default: true,
  },
  expiration: {
    type: Number,
    required: false,
    default: null,
  },
}, { timestamps: true });

const UrlModel = mongoose.model('URL', urlSchema);

module.exports = UrlModel;
