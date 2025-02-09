'use strict';

const mongoose = require('mongoose');
const { isEmail } = require('validator');

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  message: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 250,
  },
}, { timestamps: true });

const contactModel = mongoose.model('Contact', contactSchema);

module.exports = contactModel;