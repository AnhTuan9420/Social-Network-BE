const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Module = require('../models/module.model');

const create = async (data) => {
  return Module.create(data);
};

const query = async (filter, options) => {
  const result = await Module.paginate(filter, options);
  return result;
};

const getOne = async (filter) => {
  return Module.findOne(filter);
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
