const { param, body } = require('express-validator');
const baseValidation = require('./base.validation');
const { checkImageFile } = require('./custom.validation');

module.exports.validation = (type) => async (req, res, next) => {
  let validations = [];

  if (type === 'create') {
    validations = [
      body('fullName', 'fullName is required').notEmpty(),
      body('major', 'major is required').notEmpty(),
      body('experience', 'experience is required').notEmpty(),
      body('file').custom(checkImageFile),
    ];
  }

  if (type === 'getOne') {
    validations = [param('id', 'id is required').notEmpty()];
  }

  if (type === 'updateOne') {
    validations = [param('id', 'id is required').notEmpty()];
  }

  if (type === 'delete') {
    validations = [param('id', 'id is required').notEmpty()];
  }

  return baseValidation(validations, req, res, next);
};
