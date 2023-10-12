const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logger = winston.createLogger({
  // format của log được kết hợp thông qua format.combine
  format: winston.format.combine(
    winston.format.splat(),
    // Định dạng time cho log
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    // thêm màu sắc
    winston.format.colorize(),
    // thiết lập định dạng của log
    winston.format.printf((log) => {
      // nếu log là error hiển thị stack trace còn không hiển thị message của log
      if (log.stack) return `[${log.timestamp}] ${log.stack}`;
      return `[${log.timestamp}] ${log.message}`;
    })
  ),
  transports: [
    // hiển thị log thông qua console
    new winston.transports.Console(),
    // Thiết lập ghi log vào file
    new winston.transports.DailyRotateFile({
      filename: path.join('logs', 'error-%DATE%.log'),
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '7d',
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join('logs', 'info-%DATE%.log'),
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '7d',
    }),
  ],
});

module.exports = logger;
