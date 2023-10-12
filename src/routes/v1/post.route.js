const express = require('express');
const auth = require('../../middlewares/auth');
const { validation } = require('../../validations/post.validation');
const postController = require('../../controllers/post.controller');

const router = express.Router();
const { upload } = require('../../config/multer');

router
  .route('/')
  .get(auth(), postController.query)
  .post(auth(), upload.single('file'), validation('create'), postController.create);

router
  .route('/:id')
  .get(auth(), validation('getOne'), postController.getOne)
  .put(auth(), validation('updateOne'), postController.updateOne)
  .delete(auth(), validation('deleteOne'), postController.deleteOne);

module.exports = router;
