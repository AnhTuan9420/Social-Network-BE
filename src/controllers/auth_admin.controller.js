const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const adminService = require('../services/admin.service');
const tokenService = require('../services/token.service');

const register = catchAsync(async (req, res) => {
  const user = await adminService.create(req.body);
  const tokens = await tokenService.generateAuthTokens(user, 'admin');
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.loginUserWithUsernameAndPassword(username, password, 'admin');
  const tokens = await tokenService.generateAuthTokens(user, 'admin');
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken, 'admin');
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken, 'admin');
  res.send({ ...tokens });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  resetPassword,
};
