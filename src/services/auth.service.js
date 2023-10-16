const httpStatus = require('http-status');
const tokenService = require('./token.service');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { getToken, getLastToken } = require('./helper/token_helper.service');
const {
  getByEmail,
  getByUsername,
  getById,
  verifyEmailUpdate,
  resetPasswordUpdate,
} = require('./helper/user_helper.service');

const loginUserWithUsernameAndPassword = async (username, password, type) => {
  const user = await getByUsername(type, username);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Account or password is not exist!');
  }

  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect username or password!');
  }

  return user;
};

const logout = async (refreshToken, type) => {
  const refreshTokenDoc = await getToken(type, refreshToken, tokenTypes.REFRESH);

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }

  const response = await refreshTokenDoc.deleteOne();
  return response;
};

const refreshAuth = async (refreshToken, userType) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH, userType);
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Token is invalid');
    }

    const user = await getById(userType, refreshTokenDoc.user);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    /* await refreshTokenDoc.deleteOne(); */
    return tokenService.generateAuthTokens(user, userType, true, refreshTokenDoc);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const checkVerify = async (input) => {
  const { userType } = input;
  const user = await getByEmail(userType, input.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }

  if (user.forgotPasswordWrongCode === 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have entered wrong 5 times, please try again later!');
  }

  const token = await getLastToken(userType, tokenTypes.RESET_PASSWORD, user.id, { verifyCode: input.verifyCode });
  if (!token) {
    let forgotPasswordWrongCode = user.forgotPasswordWrongCode || 0;
    forgotPasswordWrongCode += 1;
    Object.assign(user, { forgotPasswordWrongCode });
    await user.save();
    throw new ApiError(httpStatus.NOT_FOUND, 'Code is invalid');
  }

  const tokenVerify = await tokenService.verifyToken(token.token, tokenTypes.RESET_PASSWORD, input.userType);
  if (tokenVerify && String(tokenVerify.user) === String(user.id)) {
    Object.assign(user, { forgotPasswordWrongCode: 0 });
    await user.save();
  }
  return tokenVerify && String(tokenVerify.user) === String(user.id);
};

const resetPassword = async (input) => {
  const isVerify = await checkVerify(input);
  if (!isVerify) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Data is invalid');
  }

  const user = await getByEmail(input.userType, input.email);
  await resetPasswordUpdate(input.userType, user, input.password);
};

const verifyEmail = async (verifyEmailToken, userType) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL, userType);
    if (!verifyEmailTokenDoc) {
      return {
        tokenError: 'Token is invalid',
      };
    }

    const user = await getById(userType, verifyEmailTokenDoc.user);
    if (!user) {
      return {
        userNotFound: 'Not found',
      };
    }

    if (user.isEmailVerified === true) {
      return {
        userVerified: 'User has been verified',
      };
    }

    const userUpdated = await verifyEmailUpdate(userType, user.id);
    return userUpdated;
  } catch (error) {
    return {
      errors: error.message,
    };
  }
};

module.exports = {
  loginUserWithUsernameAndPassword,
  logout,
  refreshAuth,
  checkVerify,
  resetPassword,
  verifyEmail,
};
