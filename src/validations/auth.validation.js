const { query, body } = require('express-validator');
const baseValidation = require('./base.validation');
const { password } = require('./custom.validation');

module.exports.authValidation =
  (type = '') =>
  async (req, res, next) => {
    let dataValidate = [];

    // register
    if (type === 'register') {
      dataValidate = [
        body('fullName', 'Fullname is required').notEmpty(),
        body('username', 'Username is required').notEmpty(),
        body('password', 'Password is required').notEmpty(),
        body('password', 'Password must be between 6 and 20 characters, contain at least one letter and one number').custom(
          password
        ),
        body('confirmPassword', 'Password is required').notEmpty(),
        body('confirmPassword', 'ConfirmPassword and Password not match').equals(req.body.password),
      ];
    }

    // login
    if (type === 'login') {
      dataValidate = [
        body('username', 'Username is required').notEmpty(),
        body('password', 'Password is required').notEmpty(),
      ];
    }

    if (type === 'loginSocial') {
      dataValidate = [body('idToken', 'idToken is required').notEmpty(), body('type', 'type is required').notEmpty()];
    }

    // logout
    if (type === 'logoutAndRefreshTokens') {
      dataValidate = [body('refreshToken', 'token is required').notEmpty()];
    }

    // Check verify
    if (type === 'checkVerify') {
      dataValidate = [
        body('email', 'Email is required').notEmpty(),
        body('verifyCode', 'verifyCode is required').notEmpty(),
      ];
    }

    // Send Verification Email
    if (type === 'sendVerificationEmail') {
      dataValidate = [body('email', 'Email is required').notEmpty()];
    }

    // reset password
    if (type === 'resetPassword') {
      dataValidate = [
        body('email', 'Email is required').notEmpty(),
        body('email', 'Email is invalid').isEmail(),
        body('verifyCode', 'verifyCode is required').notEmpty(),
        body('password', 'Password is required').notEmpty(),
        body('password', 'Password must be between 6 and 20 characters, contain at least one letter and one number').custom(
          password
        ),
        body('confirmPassword', 'Password is required').notEmpty(),
        body('confirmPassword', 'Password not match').equals(req.body.password),
      ];
    }

    // verify email
    if (type === 'verifyEmail') {
      dataValidate = [query('token', 'token is required').notEmpty()];
    }

    return baseValidation(dataValidate, req, res, next);
  };
