const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const postService = require('../services/post.service');
const fileService = require('../services/file.service');

const create = catchAsync(async (req, res) => {
  const dataImage = await fileService.uploadToCloudinary(req.file);

  if (!dataImage) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Error');
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
  const filter = pick(req.query, ['userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = 'userId';
  const result = await postService.query(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getOne = catchAsync(async (req, res) => {
  const item = await postService.getOne({ userId: req.user.id, _id: req.params.id });
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  res.status(httpStatus.OK).send(item);
});

const updateOne = catchAsync(async (req, res) => {
  const card = await postService.updateOne({ userId: req.user.id, _id: req.params.id }, req.body);
  res.status(httpStatus.OK).send(card);
});

const deleteOne = catchAsync(async (req, res) => {
  const response = await postService.deleteOne({ userId: req.user.id, _id: req.params.id });
  res.status(httpStatus.NO_CONTENT).send(response);
});

module.exports = {
  create,
  query,
  getOne,
  updateOne,
  deleteOne,
};
