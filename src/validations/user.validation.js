const baseValidation = require('./base.validation');

module.exports.validation = () => async (req, res, next) => {
  const validations = [];

  return baseValidation(validations, req, res, next);
};
