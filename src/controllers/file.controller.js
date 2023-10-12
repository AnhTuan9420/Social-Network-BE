const httpStatus = require('http-status');
const { getVideoDurationInSeconds } = require('get-video-duration');
const catchAsync = require('../utils/catchAsync');
const fileService = require('../services/file.service');
const ApiError = require('../utils/ApiError');
const Media = require('../models/media.model');

const uploadFile = catchAsync(async (req, res) => {
  const folder = req.body.folder || 'uploads';
  const data = await fileService.uploadToS3(req.file, folder);
  res.status(httpStatus.CREATED).send(data);
});

const uploadAudio = catchAsync(async (req, res) => {
  const folder = 'audio';
  const duration = await getVideoDurationInSeconds(req.file.path);
  const dataUpload = await fileService.uploadToS3(req.file, folder);
  if (duration && dataUpload) {
    const dataSubmit = {
      time: duration,
      url: dataUpload.Key,
    };
    const response = await Media.create(dataSubmit);
    res.status(httpStatus.CREATED).send(response);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Error');
  }
});

module.exports = {
  uploadFile,
  uploadAudio,
};
