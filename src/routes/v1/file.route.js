const express = require('express');
const auth = require('../../middlewares/auth');
const { fileValidation } = require('../../validations/file.validation');
const fileController = require('../../controllers/file.controller');

const router = express.Router();
const { upload, uploadAudio } = require('../../config/multer');

router.route('/upload').post(auth(), upload.single('file'), fileValidation('createImage'), fileController.uploadFile);

router
  .route('/upload-audio')
  .post(auth(), uploadAudio.single('audio'), fileValidation('createAudio'), fileController.uploadAudio);

module.exports = router;
