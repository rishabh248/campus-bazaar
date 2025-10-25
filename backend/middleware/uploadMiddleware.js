const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory buffer

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) { // More specific check
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2 // Increased limit slightly to 2MB per image
    }
});

module.exports = upload;
