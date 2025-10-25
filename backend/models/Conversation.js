const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 }); // Index for faster querying by user

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
