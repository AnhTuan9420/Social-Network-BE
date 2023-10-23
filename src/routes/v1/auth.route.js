const express = require('express');
const auth = require('../../middlewares/auth');
const { authValidation } = require('../../validations/auth.validation');
const authUserController = require('../../controllers/auth_user.controller');
const authAdminController = require('../../controllers/auth_admin.controller');

const router = express.Router();

/**
 * AUTH USER APIs
 * * */
router.post('/user/register', authValidation('register'), authUserController.register);
router.post('/user/login', authValidation('login'), authUserController.login);
router.post('/user/logout', authValidation('logoutAndRefreshTokens'), authUserController.logout);
router.post('/user/refresh-tokens', authValidation('logoutAndRefreshTokens'), authUserController.refreshTokens);
router.post('/user/reset-password', auth(), authValidation('resetPassword'), authUserController.resetPassword);

/**
 * AUTH ADMIN APIs
 * * */
router.post('/admin/register', authValidation('register', 'admin'), authAdminController.register);
router.post('/admin/login', authValidation('login'), authAdminController.login);
router.post('/admin/logout', authValidation('logoutAndRefreshTokens'), authAdminController.logout);
router.post('/admin/refresh-tokens', authValidation('logoutAndRefreshTokens'), authAdminController.refreshTokens);
router.post('/admin/reset-password', authValidation('resetPassword'), authAdminController.resetPassword);

module.exports = router;
