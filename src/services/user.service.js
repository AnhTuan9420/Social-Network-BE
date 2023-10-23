const httpStatus = require('http-status');
const User = require('../models/user.model');
const fileService = require('./file.service');
const ApiError = require('../utils/ApiError');

const create = async (userBody) => {
  if (await User.isUsernameCreated(userBody.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already exist');
  }
  return User.create(userBody);
};

const query = async (filter, options) => {
  const result = await User.paginate(filter, options);
  return result;
};

const getById = async (id) => {
  return User.findById(id);
};

const getByEmail = async (email) => {
  return User.findOne({ email });
};

const getByUsername = async (username) => {
  return User.findOne({ username });
};

const updateById = async (id, updateBody, file) => {
  const user = await getById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  if (file && user.avatar_public_id) {
    await fileService.deleteImageFromCloudinary(user.avatar_public_id);
  }
  const dataImage = await fileService.uploadToCloudinary(file);

  if (!dataImage) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Upload image fail!');
  }

  // eslint-disable-next-line no-param-reassign
  updateBody.avatar = dataImage.url;
  // eslint-disable-next-line no-param-reassign
  updateBody.avatar_public_id = dataImage.public_id;

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteById = async (id) => {
  const user = await getById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await user.removeSoft();
  return user;
};

const permanentDeleteById = async (id) => {
  const user = await getById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await user.deleteOne();
  return user;
};

module.exports = {
  create,
  query,
  getById,
  getByEmail,
  updateById,
  deleteById,
  permanentDeleteById,
  getByUsername,
};
