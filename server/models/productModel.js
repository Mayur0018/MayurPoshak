const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    unique: true,
    trim: true,
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'A product must have a description'],
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
  },
  mrp: Number,
  category: {
    type: String,
    required: [true, 'A product must belong to a category'],
  },
  subCategory: String,
  brand: {
    type: String,
    default: 'Mayur Poshak',
  },
  images: [
    {
      url: String,
      public_id: String,
    }
  ],
  variants: [
    {
      size: String,
      color: String,
      sku: String,
      stock: {
        type: Number,
        default: 0,
      },
    }
  ],
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

// Indexing for faster search
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
