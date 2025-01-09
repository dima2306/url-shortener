const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Url = require('./Url');

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
}, { timestamps: true });

// Create a virtual field to get all the URLs of a user
userSchema.virtual('urls', {
  ref: 'Url',
  localField: '_id',
  foreignField: 'user',
});

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.pre('remove', async function(next) {
  await Url.deleteMany({ user: this._id });

  next();
});

userSchema.statics.login = async function(user, password) {
  return bcrypt.compare(password, user.password);
};

/**
 * Authenticate a user using an email and a password
 *
 * @param {String} email
 * @param {String} password
 * @returns {Promise<*>}
 */
userSchema.statics.loginUsingEmail = async function(email, password) {
  const user = await this.findOne({ email });

  if (user === undefined || user === null) {
    throw new Error('User not found');
  }

  if (!await this.login(user, password)) {
    throw new Error('Credentials are incorrect');
  }

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
