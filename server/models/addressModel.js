const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Please provide full name']
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  street: {
    type: String,
    required: [true, 'Please provide street address']
  },
  city: {
    type: String,
    required: [true, 'Please provide city']
  },
  state: {
    type: String,
    required: [true, 'Please provide state']
  },
  pincode: {
    type: String,
    required: [true, 'Please provide pincode']
  },
  country: {
    type: String,
    default: 'India'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Address', addressSchema);
