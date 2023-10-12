const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const likeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
likeSchema.plugin(toJSON);
likeSchema.plugin(paginate);

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
