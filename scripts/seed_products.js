const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Define Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  images: [String],
  price: { type: Number, required: true },
  mrp: { type: Number },
  category: { type: String, required: true },
  subCategory: { type: String },
  brand: { type: String, default: "Mayur Poshak" },
  highlights: [String],
  specifications: { type: Map, of: String },
  size: [String],
  color: [String],
  sku: { type: String },
  stock: { type: Number, default: 10 },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 12 },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    // Load dataset
    const rawData = fs.readFileSync(path.join(__dirname, '../products_dataset.json'), 'utf8');
    const dataset = JSON.parse(rawData);

    // Clear existing products
    console.log('Cleaning up existing product database...');
    await Product.deleteMany({});
    console.log('Database cleared.');

    console.log(`Seeding ${dataset.length} high-quality Gen Z products...`);
    
    const productsToInsert = dataset.map((p, index) => ({
      name: p.title,
      description: `${p.tag} - Our latest ${p.brand} ${p.type}. Extremely versatile and on-trend for a modern aesthetic.`,
      image: p.image,
      images: [p.image, p.image],
      price: p.price,
      mrp: Math.floor(p.price * 1.4),
      category: p.category,
      subCategory: p.type,
      brand: p.brand,
      size: p.sizes,
      color: p.colors,
      stock: Math.floor(Math.random() * 80) + 20,
      rating: (Math.random() * (5 - 4.3) + 4.3).toFixed(1),
      reviewsCount: Math.floor(Math.random() * 200) + 5,
      highlights: [p.tag, 'Premium Quality', 'Gen Z Verified'],
      sku: `MPX-${p.brand.substring(0, 3).toUpperCase()}-${index + 100}`
    }));

    // Add extra Men's Shirts from DummyJSON for variety
    console.log('Fetching Men\'s Shirts from DummyJSON...');
    const dummyRes = await fetch('https://dummyjson.com/products/category/mens-shirts');
    const dummyData = await dummyRes.json();
    const dummyShirts = dummyData.products;

    dummyShirts.forEach((item) => {
      productsToInsert.push({
        name: item.title,
        description: item.description,
        image: item.thumbnail,
        images: item.images,
        price: Math.floor(item.price * 83),
        mrp: Math.floor(item.price * 83 * 1.5),
        category: 'men',
        subCategory: 'shirt',
        brand: item.brand,
        size: ['S', 'M', 'L', 'XL'],
        color: ['Multicolor'],
        stock: item.stock,
        rating: item.rating,
        reviewsCount: Math.floor(Math.random() * 50) + 12,
        highlights: ['Official DummyJSON data', 'Pure Cotton'],
        sku: 'DJSON-' + item.id
      });
    });

    await Product.insertMany(productsToInsert);
    console.log(`Successfully seeded ${productsToInsert.length} products!`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
