const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getAllUsers,
    deleteUser,
    getAllProducts,
    deleteProduct,
    toggleFeatureProduct
} = require('../controllers/adminController');

router.use(protect, admin);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

router.get('/products', getAllProducts);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id/feature', toggleFeatureProduct);

module.exports = router;
