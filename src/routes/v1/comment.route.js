const express = require('express');
const auth = require('../../middlewares/auth');
const { validation } = require('../../validations/comment.validation');
const commentController = require('../../controllers/comment.controller');

const router = express.Router();

router.route('/').get(auth(), commentController.query).post(auth(), validation('create'), commentController.create);

router
  .route('/:id')
  .get(auth(), validation('getOne'), commentController.getOne)
  .put(auth(), validation('updateOne'), commentController.updateOne)
  .delete(auth(), validation('deleteOne'), commentController.deleteOne);

module.exports = router;
