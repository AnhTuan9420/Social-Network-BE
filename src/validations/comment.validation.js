const { param, body } = require('express-validator');
const baseValidation = require('./base.validation');

module.exports.validation = (type) => async (req, res, next) => {
  let validations = [];

  if (type === 'create') {
    validations = [body('content', 'content is required').notEmpty()];
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
