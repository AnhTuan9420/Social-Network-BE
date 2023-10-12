const Token = require('../../models/token.model');

const createToken = async (userType, data) => {
  if (userType === 'user') {
    return Token.create(data);
  }
};

const getTokenByUserId = async (userType, token, type, user) => {
  if (userType === 'user') {
    return Token.findOne({ token, type, user });
  }
};

const getLastToken = async (userType, type, user, filterOther = {}) => {
  const filter = { type, user, ...filterOther };

  if (userType === 'user') {
    return Token.findOne(filter).sort({ createdAt: -1 });
  }
};

const getToken = async (userType, token, type) => {
  if (userType === 'user') {
    return Token.findOne({ token, type });
  }
};

const removeTokenByUserId = async (userType, userId, tokenType) => {
  if (userType === 'user') {
    await Token.deleteMany({ user: userId, type: tokenType });
  }
};

module.exports = {
  createToken,
  getTokenByUserId,
  getToken,
  removeTokenByUserId,
  getLastToken,
};
