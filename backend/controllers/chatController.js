const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Product = require('../models/Product');

const startConversation = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const buyerId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const sellerId = product.seller;

  if (buyerId.equals(sellerId)) {
    res.status(400);
    throw new Error("You can't start a conversation with yourself.");
  }

  let conversation = await Conversation.findOne({
    product: productId,
    participants: { $all: [buyerId, sellerId] },
  });

  if (conversation) {
    res.status(200).json(conversation);
  } else {
    const newConversation = await Conversation.create({
      product: productId,
      participants: [buyerId, sellerId],
    });
    res.status(201).json(newConversation);
  }
});

const getMyConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate('participants', 'name email')
    .populate('product', 'title images status')
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'name' }
    })
    .sort({ updatedAt: -1 });

  res.status(200).json(conversations);
});

const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
     res.status(404);
     throw new Error('Conversation not found');
  }

  if (!conversation.participants.some(id => id.equals(req.user._id))) {
    res.status(403);
    throw new Error('User not authorized to view this conversation');
  }

  const messages = await Message.find({ conversation: req.params.id })
    .populate('sender', 'name email')
    .sort({ createdAt: 'asc' });

  res.status(200).json(messages);
});


module.exports = {
  startConversation,
  getMyConversations,
  getMessages,
};
