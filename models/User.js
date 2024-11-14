const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  surname: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 40,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
