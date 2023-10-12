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

const upload = multer({ storage, limits: { fileSize: 20971520 } });

module.exports = { upload };
