const httpStatus = require('http-status');
const Admin = require('../models/admin.model');
const ApiError = require('../utils/ApiError');

const create = async (userBody) => {
  if (await Admin.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already exist');
  }
  if (await Admin.isUsernameCreated(userBody.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already exist');
  }
  return Admin.create(userBody);
};

const query = async (filter, options) => {
  const result = await Admin.paginate(filter, options);
  return result;
};

const getById = async (id) => {
  return Admin.findById(id);
};

const getByEmail = async (email) => {
  return Admin.findOne({ email });
};

const updateById = async (id, updateBody) => {
  const user = await getById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  if (updateBody.email && (await Admin.isEmailTaken(updateBody.email, id))) {
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

module.exports = {
  create,
  query,
  getById,
  getByEmail,
  updateById,
  deleteById,
};
