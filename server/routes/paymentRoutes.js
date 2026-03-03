const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stripe-config', authMiddleware.protect, paymentController.getStripeConfig);
router.post('/create-payment-intent', authMiddleware.protect, paymentController.createPaymentIntent);
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);

module.exports = router;
