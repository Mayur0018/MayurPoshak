const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Order = require('../models/orderModel');

exports.getStripeConfig = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });
});

exports.createPaymentIntent = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) return next(new AppError('Order not found', 404));

  const amount = Math.round(order.totalPrice * 100); // Stripe expects cents

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'inr',
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: order._id.toString() },
  });

  res.status(200).json({
    status: 'success',
    clientSecret: paymentIntent.client_secret,
  });
});

exports.stripeWebhook = catchAsync(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    
    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: Date.now().toString(),
      }
    });
  }

  res.json({ received: true });
});
