const httpStatus = require('http-status');
const User = require('../models/user.model');
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

const updateById = async (id, updateBody) => {
  const user = await getById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already exist');
  }
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
