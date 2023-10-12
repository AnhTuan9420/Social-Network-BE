const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const mediaSchema = mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
mediaSchema.plugin(toJSON);
mediaSchema.plugin(paginate);

const Media = mongoose.model('Media', mediaSchema);
module.exports = Media;
