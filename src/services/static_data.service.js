const { emotionStates, iconStatus, iconSocial } = require('../../static_data');

const getEmotionStates = async () => {
  return emotionStates.data;
};

const getIconStatus = async () => {
  return iconStatus.data;
};

const getIconSocial = async () => {
  return iconSocial.data;
};

module.exports = {
  getEmotionStates,
  getIconStatus,
  getIconSocial,
};
