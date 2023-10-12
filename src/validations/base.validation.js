const httpStatus = require('http-status');
const { validationResult } = require('express-validator');

module.exports = async (validations, req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
};
