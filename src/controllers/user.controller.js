const httpStatus = require('http-status');
// eslint-disable-next-line import/no-extraneous-dependencies
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');

const query = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.query(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getOne = catchAsync(async (req, res) => {
  const user = await userService.getById(req.user.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }

  const userFinal = { ...user.toJSON() };
  if (!userFinal.userName) {
    // eslint-disable-next-line prefer-destructuring
    userFinal.userName = userFinal.email.match(/^([^@]*)@/)[1];
  }
  if (!userFinal.name) {
    // eslint-disable-next-line prefer-destructuring
    userFinal.name = userFinal.email.match(/^([^@]*)@/)[1];
  }
  userFinal.mode = 'Trial Mode';

  res.send(userFinal);
});

const updateOne = catchAsync(async (req, res) => {
  const user = await userService.updateById(req.user.id, req.body);
  res.status(httpStatus.OK).send(user);
});

const deleteOne = catchAsync(async (req, res) => {
  await userService.deleteById(req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const permanentDeleteOne = catchAsync(async (req, res) => {
  await userService.permanentDeleteById(req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  query,
  getOne,
  updateOne,
  deleteOne,
  permanentDeleteOne,
};
