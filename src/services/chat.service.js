const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Chat = require('../models/chat.model');

const create = async (data) => {
  return Chat.create(data);
};

const query = async (filter, options) => {
  const result = await Chat.paginate(filter, options);
  return result;
};

const getOne = async (filter) => {
  return Chat.findOne(filter);
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
