const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const moduleService = require('../services/module.service');

const create = catchAsync(async (req, res) => {
  const data = req.body;
  data.userId = req.user.id;
  const item = await moduleService.create(data);
  res.status(httpStatus.CREATED).send(item);
});

const query = catchAsync(async (req, res) => {
  const filter = {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await moduleService.query(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getOne = catchAsync(async (req, res) => {
  const item = await moduleService.getOne({ _id: req.params.id });
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  res.status(httpStatus.OK).send(item);
});

const updateOne = catchAsync(async (req, res) => {
  const card = await moduleService.updateOne({ userId: req.user.id, _id: req.params.id }, req.body);
  res.status(httpStatus.OK).send(card);
});

const deleteOne = catchAsync(async (req, res) => {
  await moduleService.deleteOne({ userId: req.user.id, _id: req.params.id });
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  query,
  getOne,
  updateOne,
  deleteOne,
};
