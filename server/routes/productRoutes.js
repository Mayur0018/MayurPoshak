const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Admin only routes
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.post('/', upload.array('images', 5), productController.createProduct);
router.patch('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
