const asyncHandler = require('express-async-handler');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Upload images to Cloudinary
// @route   POST /api/upload/images
// @access  Private
const uploadImages = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        res.status(400);
        throw new Error('No files uploaded.');
    }
    
    // Max 5 images
    if (req.files.length > 5) {
        res.status(400);
        throw new Error('Cannot upload more than 5 images at a time.');
    }

    const uploadPromises = req.files.map(file => {
        return uploadToCloudinary(file.buffer, {
            folder: 'campus-bazaar',
            resource_type: 'image',
            transformation: [{ width: 800, height: 800, crop: 'limit' }]
        });
    });

    try {
        const results = await Promise.all(uploadPromises);
        const uploadedFiles = results.map(result => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));
        res.status(201).json(uploadedFiles);
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500);
        throw new Error('Image upload failed. Please try again.');
    }
});

module.exports = { uploadImages };
