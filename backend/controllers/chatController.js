const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Product = require('../models/Product');

/**
 * @desc    Start or get a conversation
 * @route   POST /api/chat
 * @access  Private
 */
const startConversation = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const buyerId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const sellerId = product.seller;

  // Check if buyer is the seller
  if (buyerId.equals(sellerId)) {
    res.status(400);
    throw new Error("You can't start a conversation with yourself.");
  }

  // Check if a conversation already exists between these two users for this product
  let conversation = await Conversation.findOne({
    product: productId,
    participants: { $all: [buyerId, sellerId] },
  });

  if (conversation) {
    // If conversation exists, return it
    res.status(200).json(conversation);
  } else {
    // If not, create a new one
    const newConversation = await Conversation.create({
      product: productId,
      participants: [buyerId, sellerId],
    });
    res.status(201).json(newConversation);
  }
});

/**
 * @desc    Get all conversations for a user
 * @route   GET /api/chat
 * @access  Private
 */
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

/**
 * @desc    Get messages for a conversation
 * @route   GET /api/chat/:id/messages
 * @access  Private
 */
const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  // Check if user is part of this conversation
  if (!conversation.participants.includes(req.user._id)) {
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