const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const chatService = require('../services/chat.service');
const { matchFilter } = require('../helper/functions');

const create = catchAsync(async (req, res) => {
  const data = req.body;
  data.from = req.user.id;
  const item = await chatService.create(data);
  // eslint-disable-next-line no-undef
  _io.to([data.from, data.to]).emit('message', item);
  res.status(httpStatus.CREATED).send(item);
});

const query = catchAsync(async (req, res) => {
  const filter = matchFilter(req.user.id, req.query.to);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await chatService.query(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getOne = catchAsync(async (req, res) => {
  const item = await chatService.getOne({ _id: req.params.id });
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  res.status(httpStatus.OK).send(item);
});

const updateOne = catchAsync(async (req, res) => {
  const card = await chatService.updateOne({ userId: req.user.id, _id: req.params.id }, req.body);
  res.status(httpStatus.OK).send(card);
});

const deleteOne = catchAsync(async (req, res) => {
  await chatService.deleteOne({ _id: req.params.id });
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  query,
  getOne,
  updateOne,
  deleteOne,
};
