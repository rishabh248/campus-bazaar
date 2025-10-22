const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        // Prevent admin from deleting themselves
        if (user._id.equals(req.user._id)) {
            res.status(400);
            throw new Error('Admins cannot delete their own account.');
        }
        await user.deleteOne();
        // Also remove their products
        await Product.deleteMany({ seller: user._id });
        res.json({ message: 'User and their products removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate('seller', 'name email').sort({ createdAt: -1 });
    res.json(products);
});

// @desc    Delete a product (as admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Toggle feature status of a product
// @route   PUT /api/admin/products/:id/feature
// @access  Private/Admin
const toggleFeatureProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        product.isFeatured = !product.isFeatured;
        await product.save();
        res.json({ message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'} successfully.` });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getAllUsers,
    deleteUser,
    getAllProducts,
    deleteProduct,
    toggleFeatureProduct
};
