const express = require('express');
const auth = require('../../middlewares/auth');
const { validation } = require('../../validations/module.validation');
const moduleController = require('../../controllers/module.controller');

const router = express.Router();

router.route('/').get(auth(), moduleController.query).post(auth(), validation('create'), moduleController.create);

router
  .route('/:id')
  .get(auth(), validation('getOne'), moduleController.getOne)
  .put(auth(), validation('updateOne'), moduleController.updateOne)
  .delete(auth(), validation('deleteOne'), moduleController.deleteOne);

module.exports = router;
