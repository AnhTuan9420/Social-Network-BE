// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs');
const { Upload } = require('@aws-sdk/lib-storage');
// eslint-disable-next-line import/no-extraneous-dependencies
const { S3Client } = require('@aws-sdk/client-s3');

const uploadToS3 = async (file, folder = 'uploads') => {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'ap-southeast-1',
  });

  const imagePath = file.path;
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const blob = fs.readFileSync(imagePath);
  let key = file.originalname;
  const keyArray = key.split('.');
  const extension = keyArray.pop();

  if (folder) {
    const fileName = `${keyArray.join('.')}${Date.now()}${(Math.random() + 1).toString(36).slice(-4)}`;
    key = `${folder}/${fileName}.${extension}`;
  }

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Body: blob,
    ACL: 'public-read',
  };

  const parallelUploads3 = new Upload({
    client: s3,
    params,
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false, // optional manually handle dropped parts
  });

  const uploadedImage = await parallelUploads3.done();

  // xóa file trên local sau khi upload
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.unlink(imagePath, (err) => {
    // eslint-disable-next-line no-console
    if (!err) console.log(`Deleted file: ${imagePath}`);
  });

  return uploadedImage;
};

module.exports = {
  uploadToS3,
};
