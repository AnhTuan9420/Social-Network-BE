const multer = require('multer');

// SET STORAGE
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 2097152 } });

const uploadAudio = multer({
  storage,
  limits: {
    fileSize: 20971520, // 20 MB
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(mp3|wav|flac|aac|ogg)$/)) {
      return cb(new Error('Type of file is invalid'));
    }
    cb(undefined, true);
  },
});

module.exports = { upload, uploadAudio };
