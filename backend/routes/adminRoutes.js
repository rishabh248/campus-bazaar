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

router.use(protect, admin); // Protect all routes in this file

router.route('/users').get(getAllUsers);
router.route('/users/:id').delete(deleteUser);

router.route('/products').get(getAllProducts);
router.route('/products/:id').delete(deleteProduct);
router.route('/products/:id/feature').put(toggleFeatureProduct);

module.exports = router;
