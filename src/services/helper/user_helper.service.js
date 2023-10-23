const { tokenTypes } = require('../../config/tokens');
const userService = require('../user.service');
const Token = require('../../models/token.model');

const getByEmail = async (userType, email) => {
  if (userType === 'user') {
    return userService.getByEmail(email);
  }
};

const getByUsername = async (userType, username) => {
  if (userType === 'user') {
    return userService.getByUsername(username);
  }
};

const getById = async (userType, userId) => {
  if (userType === 'user') {
    return userService.getById(userId);
  }
};

const verifyEmailUpdate = async (userType, userId) => {
  if (userType === 'user') {
    await Token.deleteMany({ user: userId, type: tokenTypes.VERIFY_EMAIL });
    return userService.updateById(userId, { isEmailVerified: true });
  }
};

const resetPasswordUpdate = async (user, newPassword) => {
  if (user) {
    await userService.updateById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  }
};

module.exports = {
  getByEmail,
  getById,
  verifyEmailUpdate,
  resetPasswordUpdate,
  getByUsername,
};
