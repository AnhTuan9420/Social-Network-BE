const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config/config');
const { roleRights } = require('../config/roles');
const userService = require('../services/user.service');
const adminService = require('../services/admin.service');

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    const bearerAuthorization = req.headers.authorization;

    const unauthorizedResponse = {
      code: httpStatus.UNAUTHORIZED,
      message: 'Please authenticate',
    };

    const forbiddenResponse = {
      code: httpStatus.FORBIDDEN,
      message: 'Forbidden',
    };

    if (typeof bearerAuthorization === 'undefined') {
      return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedResponse);
    }

    try {
      const tokenBreak = bearerAuthorization.split(' ');
      const token = tokenBreak[1];
      const decoded = await jwt.verify(token, config.jwt.secret);

      const userId = decoded.id;
      const userType = decoded.user_role;

      let user = {};
      let userRole = '';

      if (userType === 'user') {
        user = await userService.getById(userId);
        userRole = 'user';
      }

      if (userType === 'admin') {
        user = await adminService.getById(userId);
      }

      if (requiredRights.length) {
        const userRights = roleRights.get(userRole);
        const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
        if (!hasRequiredRights) {
          return res.status(httpStatus.FORBIDDEN).send(forbiddenResponse);
        }
      }

      if (req.params.userId && req.params.userId !== user.id) {
        return res.status(httpStatus.FORBIDDEN).send(forbiddenResponse);
      }

      /* if (req.body.userId && req.body.userId !== user.id) {
        return res.status(httpStatus.FORBIDDEN).send(forbiddenResponse);
      } */

      req.user = user;
    } catch (err) {
      return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedResponse);
    }

    return next();
  };

module.exports = auth;
