const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

const getProducts = asyncHandler(async (req, res) => {
    const { search, category, status, minPrice, maxPrice, sortBy } = req.query;
    let query = {};

    if (search) {
        query.$text = { $search: search };
    }
    if (category) {
        query.category = category;
    }

    query.status = status || 'available';

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) {
            query.price.$gte = Number(minPrice);
        }
        if (maxPrice) {
            query.price.$lte = Number(maxPrice);
        }
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy) {
        switch (sortBy) {
            case 'price-asc':
                sortOptions = { price: 1 };
                break;
            case 'price-desc':
                sortOptions = { price: -1 };
                break;
            case 'date-asc':
                sortOptions = { createdAt: 1 };
                break;
        }
    }

    const products = await Product.find(query)
        .populate('seller', 'name')
        .sort(sortOptions);

    res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404);
        throw new Error('Invalid product ID');
    }
    const product = await Product.findById(req.params.id).populate('seller', 'name batch department');
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const createProduct = asyncHandler(async (req, res) => {
    const { title, description, price, category, condition, images } = req.body;

    if (!title || !description || !price || !category || !condition || !images || images.length === 0) {
        res.status(400);
        throw new Error('Please provide all required fields and at least one image.');
    }

    const product = new Product({
        title,
        description,
        price,
        category,
        condition,
        images,
        seller: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
    const { title, description, price, category, condition, status } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.seller.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('User not authorized to update this product');
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price === undefined ? product.price : price; // Handle 0 price
    product.category = category || product.category;
    product.condition = condition || product.condition;
    product.status = status || product.status;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('User not authorized to delete this product');
    }

    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
});

const getMyProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
});


module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getMyProducts };
