const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const tokenService = require('../services/token.service');

const register = catchAsync(async (req, res) => {
  const user = await userService.create(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.loginUserWithUsernameAndPassword(username, password, 'user');
  const tokens = await tokenService.generateAuthTokens(user, 'user');
  res.status(httpStatus.OK).send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const response = await authService.logout(req.body.refreshToken, 'user');
  res.status(httpStatus.NO_CONTENT).send(response);
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken, 'user');
  res.status(httpStatus.OK).send({ ...tokens });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword({
    ...req.body,
    userType: 'user',
  });
  res.send({
    success: true,
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  resetPassword,
};
