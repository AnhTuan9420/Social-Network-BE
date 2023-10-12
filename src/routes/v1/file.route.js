const express = require('express');
// const auth = require('../../middlewares/auth');
const { fileValidation } = require('../../validations/file.validation');
const fileController = require('../../controllers/file.controller');

const router = express.Router();
const { upload } = require('../../config/multer');

router.route('/upload').post(upload.single('file'), fileValidation('create'), fileController.uploadCloudinary);

module.exports = router;
