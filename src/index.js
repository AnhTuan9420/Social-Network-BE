const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const socketService = require('./services/socket.service');
const ApiError = require('./utils/ApiError');

let server;

const httpServer = http.createServer(app);

// socket io
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) return next(new Error('Authentication error'));
      // eslint-disable-next-line no-param-reassign
      socket.decoded = decoded;
      socket.join(decoded.id);
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
});

global._io = io;
io.on('connection', socketService.connection);

// mongo connection
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then((db) => {
    app.set('myDatabase', db);
    logger.info(`Worker ${process.pid} started`);
    logger.info('Connected to MongoDB');
    server = httpServer.listen(config.port, async () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch((error) => {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
/* } */
