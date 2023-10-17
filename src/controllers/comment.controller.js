const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const commentService = require('../services/comment.service');

const create = catchAsync(async (req, res) => {
  const dataSubmit = {
    postId: req.body.postId,
    content: req.body.content,
    userId: req.user.id,
  };
  const item = await commentService.create(dataSubmit);
  res.status(httpStatus.CREATED).send(item);
});

const query = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['postId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = 'userId';
  const result = await commentService.query(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getOne = catchAsync(async (req, res) => {
  const item = await commentService.getOne({ _id: req.params.id });
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  res.status(httpStatus.OK).send(item);
});

const updateOne = catchAsync(async (req, res) => {
  const card = await commentService.updateOne({ userId: req.user.id, _id: req.params.id }, req.body);
  res.status(httpStatus.OK).send(card);
});

const deleteOne = catchAsync(async (req, res) => {
  await commentService.deleteOne({ userId: req.user.id, _id: req.params.id });
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  query,
  getOne,
  updateOne,
  deleteOne,
};
