const express = require('express');
const auth = require('../../middlewares/auth');
// const { validation } = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { upload } = require('../../config/multer');

const router = express.Router();

router
  .route('/')
  .get(auth(), userController.query)
  .put(auth(), upload.single('file'), userController.updateOne)
  .delete(auth(), userController.deleteOne);

router.route('/profile').get(auth(), userController.getOne);

router.route('/permanent-delete/:userId').delete(auth(), userController.permanentDeleteOne);

module.exports = router;
