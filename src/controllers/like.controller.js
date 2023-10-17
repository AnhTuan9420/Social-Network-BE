const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const likeService = require('../services/like.service');

const create = catchAsync(async (req, res) => {
  const dataSubmit = {
    postId: req.body.postId,
    userId: req.user.id,
  };
  const item = await likeService.create(dataSubmit);
  res.status(httpStatus.CREATED).send(item);
});

const query = catchAsync(async (req, res) => {
  const filter = {};
  filter.userId = req.user.id;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = 'postId, postId.userId';
  const result = await likeService.query(filter, options);
  res.status(httpStatus.OK).send(result);
});

const totaLikeOfPost = catchAsync(async (req, res) => {
  const count = await likeService.count({ postId: req.query.postId });
  res.status(httpStatus.OK).send({ postId: req.query.postId, totalLike: count });
});

const checkUserLike = catchAsync(async (req, res) => {
  const item = await likeService.getOne({ userId: req.user.id, postId: req.query.postId });
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  res.status(httpStatus.OK).send(item);
});

const getOne = catchAsync(async (req, res) => {
  const item = await likeService.getOne({ _id: req.params.id });
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  res.status(httpStatus.OK).send(item);
});

const updateOne = catchAsync(async (req, res) => {
  const card = await likeService.updateOne({ userId: req.user.id, _id: req.params.id }, req.body);
  res.status(httpStatus.OK).send(card);
});

const deleteOne = catchAsync(async (req, res) => {
  await likeService.deleteOne({ userId: req.user.id, _id: req.params.id });
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  query,
  getOne,
  updateOne,
  deleteOne,
  checkUserLike,
  totaLikeOfPost,
};
