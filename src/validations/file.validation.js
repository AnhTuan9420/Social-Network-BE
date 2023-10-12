const { body } = require('express-validator');
const baseValidation = require('./base.validation');
const { checkAudioFile, checkImageFile } = require('./custom.validation');

module.exports.fileValidation = (type) => async (req, res, next) => {
  let validations = [];

  if (type === 'createAudio') {
    validations = [body('audio').custom(checkAudioFile)];
  }

  if (type === 'createImage') {
    validations = [body('file').custom(checkImageFile)];
  }

  return baseValidation(validations, req, res, next);
};
