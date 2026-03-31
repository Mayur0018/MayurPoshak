const Address = require('../models/addressModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllAddresses = catchAsync(async (req, res, next) => {
  const addresses = await Address.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: addresses.length,
    data: {
      addresses
    }
  });
});

exports.createAddress = catchAsync(async (req, res, next) => {
  // Add user to body
  req.body.user = req.user.id;

  // If this is the first address, make it default
  const addressCount = await Address.countDocuments({ user: req.user.id });
  if (addressCount === 0) {
    req.body.isDefault = true;
  }

  // If new address is set to default, unset other defaults
  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user.id }, { isDefault: false });
  }

  const newAddress = await Address.create(req.body);

  // Add address to user
  await User.findByIdAndUpdate(req.user.id, {
    $push: { addresses: newAddress._id }
  });

  res.status(201).json({
    status: 'success',
    data: {
      address: newAddress
    }
  });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user.id });

  if (!address) {
    return next(new AppError('No address found with that ID for this user', 404));
  }

  // If setting to default, unset others
  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user.id }, { isDefault: false });
  }

  const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      address: updatedAddress
    }
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!address) {
    return next(new AppError('No address found with that ID for this user', 404));
  }

  // Remove from user
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { addresses: req.params.id }
  });

  // If deleted was default, make another one default if exists
  if (address.isDefault) {
    const anotherAddress = await Address.findOne({ user: req.user.id });
    if (anotherAddress) {
      anotherAddress.isDefault = true;
      await anotherAddress.save();
    }
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
