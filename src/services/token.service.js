const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { createToken, getTokenByUserId, removeTokenByUserId } = require('./helper/token_helper.service');
const { getByEmail } = require('./helper/user_helper.service');

const generateToken = (userId, userRole, expires, type, secret = config.jwt.secret) => {
  const payload = {
    id: userId,
    user_role: userRole,
    token_type: type,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false, userType) => {
  const data = {
    token,
    user: userId,
    expireAt: expires.toDate(),
    type,
    blacklisted,
  };

  const tokenDoc = await createToken(userType, data);
  return tokenDoc;
};

const removeOldToken = async (userId, userType, tokenType) => {
  await removeTokenByUserId(userType, userId, tokenType);
};

const verifyToken = async (token, type, userType) => {
  const payload = jwt.verify(token, config.jwt.secret, function (err, decode) {
    if (err) {
      return false;
    }
    return decode;
  });

  const tokenDoc = await getTokenByUserId(userType, token, type, payload.id);

  if (!tokenDoc) {
    return false;
  }
  return tokenDoc;
};

const generateAuthTokens = async (user, userType, isRefresh = false, oldRefreshInfo = null) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, userType, accessTokenExpires, tokenTypes.ACCESS);

  let refreshInfo = {};
  if (!isRefresh) {
    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user.id, userType, refreshTokenExpires, tokenTypes.REFRESH);

    await removeOldToken(user.id, userType, tokenTypes.REFRESH);
    await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH, false, userType);

    refreshInfo = {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    };
  } else {
    refreshInfo = {
      token: oldRefreshInfo.token,
      expires: oldRefreshInfo.expires,
    };
  }

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: refreshInfo,
  };
};

const generateResetPasswordToken = async (userType, user) => {
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, userType, expires, tokenTypes.RESET_PASSWORD);
  await removeOldToken(user.id, userType, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD, false, userType);
  return resetPasswordToken;
};

const generateVerifyEmailToken = async (email, userType) => {
  const user = await getByEmail(userType, email);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email is invalid');
  }

  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, userType, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL, false, userType);
  return verifyEmailToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
