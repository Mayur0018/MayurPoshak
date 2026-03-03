const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { cloudinary } = require('../utils/cloudinary');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  // Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering (price[gte]=500)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Product.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const products = await query;
  const total = await Product.countDocuments(JSON.parse(queryStr));

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    data: { products },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const productData = { ...req.body };
  
  if (req.files) {
    productData.images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));
  }

  const newProduct = await Product.create(productData);

  res.status(201).json({
    status: 'success',
    data: { product: newProduct },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('No product found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) return next(new AppError('No product found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new AppError('No product found with that ID', 404));

  // Also delete images from Cloudinary
  if (product.images && product.images.length > 0) {
    const deletePromises = product.images.map(img => cloudinary.uploader.destroy(img.public_id));
    await Promise.all(deletePromises);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
