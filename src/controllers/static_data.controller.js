const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const staticDataService = require('../services/static_data.service');

const getEmotionStates = catchAsync(async (req, res) => {
  const data = await staticDataService.getEmotionStates();
  res.status(httpStatus.OK).send(data);
});

const getIconStatus = catchAsync(async (req, res) => {
  const data = await staticDataService.getIconStatus();
  res.status(httpStatus.OK).send(data);
});

const getIconSocial = catchAsync(async (req, res) => {
  const data = await staticDataService.getIconSocial();
  res.status(httpStatus.OK).send(data);
});

module.exports = {
  getEmotionStates,
  getIconStatus,
  getIconSocial,
};
