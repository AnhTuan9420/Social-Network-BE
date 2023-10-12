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
  return Post.findOne(filter);
};

const updateOne = async (filter, updateBody) => {
  const item = await getOne(filter);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
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
