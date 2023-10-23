const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Post = require('../models/post.model');
const fileService = require('./file.service');

const create = async (data) => {
  return Post.create(data);
};

const query = async (filter, options) => {
  const result = await Post.paginate(filter, options);
  return result;
};

const getOne = async (filter) => {
  return Post.findOne(filter).populate('userId');
};

const updateOne = async (filter, updateBody, file) => {
  const item = await getOne(filter);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }

  if (file && item.image_public_id) {
    await fileService.deleteImageFromCloudinary(item.image_public_id);
  }
  const dataImage = await fileService.uploadToCloudinary(file);

  if (!dataImage) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Upload image fail!');
  }
  // eslint-disable-next-line no-param-reassign
  updateBody.image = dataImage.url;
  // eslint-disable-next-line no-param-reassign
  updateBody.image_public_id = dataImage.public_id;

  Object.assign(item, updateBody);
  await item.save();
  return item;
};

const deleteOne = async (filter) => {
  const item = await getOne(filter);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await fileService.deleteImageFromCloudinary(item.image_public_id);
  await item.deleteOne();
  return item;
};

module.exports = {
  create,
  query,
  getOne,
  updateOne,
  deleteOne,
};
