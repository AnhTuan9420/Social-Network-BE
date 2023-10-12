const { genders } = require('../../static_data');

const objectId = (value) => {
  return value && value.match(/^[0-9a-fA-F]{24}$/);
};

const phoneValidate = (value) => {
  return value && value.match(/^[0-9]+$/);
};

/* const containsSpecialChars = (str) => {
  const specialChars = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
  return specialChars.test(str);
}; */

const password = (value) => {
  return value && value.length >= 6 && value.length <= 20 && value.match(/\d/);
};

const fullname = (value) => {
  return value && value.length >= 6 && value.length <= 20;
};

const genderValidate = (value) => {
  const genderValue = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < genders.data.length; i++) {
    genderValue.push(genders.data[i].value);
  }
  return genderValue.includes(value);
};

const emailOrPhone = (value, { req }) => {
  return !(!req.body.email && !req.body.phone);
};

const checkImageFile = (value, { req }) => {
  if (!req.file) {
    throw new Error('image is required');
  }
  return true;
};

const checkAudioFile = (value, { req }) => {
  if (!req.file) {
    throw new Error('audioURL is required');
  }
  return true;
};

module.exports = {
  objectId,
  phoneValidate,
  password,
  genderValidate,
  emailOrPhone,
  checkImageFile,
  checkAudioFile,
  fullname,
};
