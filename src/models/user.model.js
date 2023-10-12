const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate, softRemove } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      default: null,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
      private: true, // used by the toJSON plugin
    },
    fullName: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(softRemove);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */

userSchema.statics.isUsernameCreated = async function (username) {
  const user = await this.findOne({ username });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  if (!user.password || user.password === '') {
    return false;
  }
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
