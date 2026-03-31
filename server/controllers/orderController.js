const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/emailUtils');

exports.createOrder = catchAsync(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new AppError('No order items', 400));
  }

  // Check stock before creating order
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    const variant = product.variants.find(v => v.sku === item.variant.sku);
    
    if (!variant || variant.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for ${item.name}`, 400));
    }
  }

  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Calculate points (1 point per 100 Rs)
  const pointsEarned = Math.floor(totalPrice / 100);
  order.pointsEarned = pointsEarned;

  const createdOrder = await order.save();

  // Update stock after order creation
  for (const item of orderItems) {
    await Product.updateOne(
      { _id: item.product, 'variants.sku': item.variant.sku },
      { $inc: { 'variants.$.stock': -item.quantity } }
    );
  }

  // Award points to user
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { points: pointsEarned }
  });

  // Send email to user
  try {
    await sendEmail({
      email: req.user.email,
      subject: `Order Recieved - Mayur Poshak #${createdOrder._id.toString().slice(-6).toUpperCase()}`,
      message: `Thank you for your order! Your order #${createdOrder._id} has been received and is being processed.`,
      html: `<h1>Order Confirmation</h1><p>Thank you for your order!</p><p>Order ID: <b>#${createdOrder._id}</b></p><p>Total: <b>₹${totalPrice}</b></p><p>Points Earned: <b>${pointsEarned}</b></p>`
    });
  } catch (err) {
    console.error('Email sending failed:', err);
  }

  res.status(201).json({
    status: 'success',
    data: { order: createdOrder },
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) return next(new AppError('Order not found', 404));

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: { orders },
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new AppError('Order not found', 404));

  order.status = req.body.status || order.status;
  if (req.body.status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  // Send email on status change
  try {
    const populatedOrder = await Order.findById(updatedOrder._id).populate('user', 'email name');
    await sendEmail({
      email: populatedOrder.user.email,
      subject: `Order Status Update: ${updatedOrder.status} - Mayur Poshak`,
      message: `Your order #${updatedOrder._id} status has been updated to: ${updatedOrder.status}`,
      html: `<h1>Order Status Update</h1><p>Hi ${populatedOrder.user.name},</p><p>Your order <b>#${updatedOrder._id}</b> status has been updated to: <b>${updatedOrder.status}</b></p>`
    });
  } catch (err) {
    console.error('Status email failed:', err);
  }

  res.status(200).json({
    status: 'success',
    data: { order: updatedOrder },
  });
});
