const express = require('express');
const auth = require('../../middlewares/auth');
const { validation } = require('../../validations/chat.validation');
const chatController = require('../../controllers/chat.controller');

const router = express.Router();

router.route('/').get(auth(), chatController.query).post(auth(), validation('create'), chatController.create);

router
  .route('/:id')
  .get(auth(), validation('getOne'), chatController.getOne)
  .put(auth(), validation('updateOne'), chatController.updateOne)
  .delete(auth(), validation('deleteOne'), chatController.deleteOne);

module.exports = router;
