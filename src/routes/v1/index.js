const express = require('express');
const staticDataRoute = require('./static_data.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const moduleRoute = require('./module.route');
const fileRoute = require('./file.route');
const chatRoute = require('./chat.route');
const postRoute = require('./post.route');
const i18n = require('../../config/i18n');

const router = express.Router();

router.get('/', (req, res) => {
  const variable = i18n.__('APIs is working!');
  res.send(variable);
});

const defaultRoutes = [
  {
    path: '/static-data',
    route: staticDataRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/module',
    route: moduleRoute,
  },
  {
    path: '/file',
    route: fileRoute,
  },
  {
    path: '/chat',
    route: chatRoute,
  },
  {
    path: '/post',
    route: postRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
