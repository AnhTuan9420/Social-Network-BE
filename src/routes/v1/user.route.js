const express = require('express');
const auth = require('../../middlewares/auth');
// const { validation } = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), userController.getOne)
  .put(auth(), userController.updateOne)
  .delete(auth(), userController.deleteOne);

router.route('/permanent-delete/:userId').delete(auth(), userController.permanentDeleteOne);

module.exports = router;
