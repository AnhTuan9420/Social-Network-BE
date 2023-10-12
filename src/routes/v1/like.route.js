const express = require('express');
const auth = require('../../middlewares/auth');
const { validation } = require('../../validations/like.validation');
const likeController = require('../../controllers/like.controller');

const router = express.Router();

router.route('/').get(auth(), likeController.query).post(auth(), validation('create'), likeController.create);
router.route('/checkUserLike').get(auth(), likeController.checkUserLike);

router
  .route('/:id')
  .get(auth(), validation('getOne'), likeController.getOne)
  .put(auth(), validation('updateOne'), likeController.updateOne)
  .delete(auth(), validation('deleteOne'), likeController.deleteOne);

module.exports = router;
