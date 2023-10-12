const express = require('express');
const auth = require('../../middlewares/auth');
const staticDataController = require('../../controllers/static_data.controller');

const router = express.Router();

router.route('/emotion-status').get(auth(), staticDataController.getEmotionStates);
router.route('/icon-status').get(auth(), staticDataController.getIconStatus);
router.route('/icon-social').get(auth(), staticDataController.getIconSocial);

module.exports = router;
