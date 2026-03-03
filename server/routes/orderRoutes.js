const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/', orderController.createOrder);
router.get('/myorders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

// Admin only routes
router.patch('/:id/status', authMiddleware.restrictTo('admin'), orderController.updateOrderStatus);

module.exports = router;
