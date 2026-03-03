const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_ACCESS_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 4) Check if user changed password after the token was issued (Optional but good for security)
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(new AppError('User recently changed password! Please log in again.', 401));
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

exports.refreshToken = catchAsync(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return next(new AppError('No refresh token provided', 401));
  
  const refreshToken = cookies.jwt;

  // Verify token
  const decoded = await promisify(jwt.verify)(refreshToken, process.env.JWT_REFRESH_SECRET);

  // Check if user exists
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError('User not found', 401));

  // Generate new access token
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });

  res.status(200).json({
    status: 'success',
    accessToken,
  });
});
