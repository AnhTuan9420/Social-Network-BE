const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const postService = require('../services/post.service');
const likeService = require('../services/like.service');
const fileService = require('../services/file.service');

const create = catchAsync(async (req, res) => {
  const dataImage = await fileService.uploadToCloudinary(req.file);

  if (!dataImage) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Upload image fail!');
  }

  const dataSubmit = {
    title: req.body.title,
    image: dataImage.url,
    image_public_id: dataImage.public_id,
    userId: req.user.id,
  };

  const response = await postService.create(dataSubmit);
  res.status(httpStatus.CREATED).send(response);
});

const query = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'title']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = 'userId';

  if (filter.title) {
    const trimmedSearch = filter.title.trim();
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regex = new RegExp(trimmedSearch, 'i');
    filter.title = { $regex: regex };
  }

  const result = await postService.query(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getOne = catchAsync(async (req, res) => {
  const item = await postService.getOne({ _id: req.params.id });
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  res.status(httpStatus.OK).send(item);
});

const updateOne = catchAsync(async (req, res) => {
  const card = await postService.updateOne({ userId: req.user.id, _id: req.params.id }, req.body, req.file);
  res.status(httpStatus.OK).send(card);
});

const deleteOne = catchAsync(async (req, res) => {
  const response = await postService.deleteOne({ userId: req.user.id, _id: req.params.id });
  await likeService.deleteOne({ postId: req.params.id });
  res.status(httpStatus.NO_CONTENT).send(response);
});

module.exports = {
  create,
  query,
  getOne,
  updateOne,
  deleteOne,
};
