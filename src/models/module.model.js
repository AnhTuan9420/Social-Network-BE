const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const moduleSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
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
moduleSchema.plugin(toJSON);
moduleSchema.plugin(paginate);

moduleSchema.statics.isSlugTaken = async function (slug, excludeModuleId) {
  const item = await this.findOne({ slug, _id: { $ne: excludeModuleId } });
  return !!item;
};

const Module = mongoose.model('Module', moduleSchema);
module.exports = Module;
