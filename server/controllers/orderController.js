const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

  const createdOrder = await order.save();

  // Update stock after order creation
  for (const item of orderItems) {
    await Product.updateOne(
      { _id: item.product, 'variants.sku': item.variant.sku },
      { $inc: { 'variants.$.stock': -item.quantity } }
    );
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

  res.status(200).json({
    status: 'success',
    data: { order: updatedOrder },
  });
});
