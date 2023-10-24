const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const chatSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
      trim: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.plugin(toJSON);
chatSchema.plugin(paginate);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
