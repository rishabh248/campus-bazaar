const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Show interest in a product
// @route   POST /api/interests/:productId/show
// @access  Private
const showInterest = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.seller.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error("You cannot show interest in your own product.");
    }

    const alreadyInterested = product.interestedBuyers.some(id => id.equals(req.user._id));

    if (alreadyInterested) {
        res.status(400);
        throw new Error("You have already shown interest in this product.");
    }

    product.interestedBuyers.push(req.user._id);
    await product.save();

    // Create a notification for the seller
    await Notification.create({
        recipient: product.seller,
        sender: req.user._id,
        product: product._id,
        type: 'interest',
        message: `${req.user.name} is interested in your product: ${product.title}`
    });

    res.status(200).json({ message: 'Interest shown successfully. You can now view seller details.' });
});

// @desc    Get seller contact info for a product user is interested in
// @route   GET /api/interests/:productId/seller-contact
// @access  Private
const getSellerContact = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    if (!product) {
        res.status(404); throw new Error('Product not found');
    }

    const isInterested = product.interestedBuyers.some(id => id.equals(req.user._id));
    const isSeller = product.seller.equals(req.user._id);

    if (!isInterested && !isSeller) {
        res.status(403);
        throw new Error('You must show interest to view seller contact information.');
    }
    
    const seller = await User.findById(product.seller).select('name email phone');
    if (!seller) {
        res.status(404); throw new Error('Seller not found');
    }

    res.json(seller);
});

// @desc    Get products the current user is interested in
// @route   GET /api/interests/my
// @access  Private
const getMyInterests = asyncHandler(async (req, res) => {
    const products = await Product.find({ interestedBuyers: req.user._id })
        .populate('seller', 'name')
        .sort({ createdAt: -1 });
    res.json(products);
});


// @desc    Get all notifications for the current user
// @route   GET /api/interests/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .populate('sender', 'name')
        .populate('product', 'title')
        .sort({ createdAt: -1 });

    res.json(notifications);
});

// @desc    Mark a notification as read
// @route   PUT /api/interests/notifications/:id/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }
    
    if (notification.recipient.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this notification');
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
});


module.exports = {
    showInterest,
    getSellerContact,
    getMyInterests,
    getMyNotifications,
    markNotificationAsRead
};
