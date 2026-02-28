import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  images: [String],
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  brand: { type: String },
  highlights: [String],
  specifications: { type: Map, of: String },
  size: [String],
  color: [String],
  stock: { type: Number, default: 10 },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 12 },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// Premium HD Images from Unsplash
const unsplashImages = {
  mens_shirts: [
    "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=1920&auto=format&fit=crop", // Blue plaid
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1920&auto=format&fit=crop", // White shirt
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1920&auto=format&fit=crop", // Denim shirt
    "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?q=80&w=1920&auto=format&fit=crop", // Casual
  ],
  womens_dresses: [
    "https://images.unsplash.com/photo-1515347619362-e67bb968e1ab?q=80&w=1920&auto=format&fit=crop", // Elegant dress
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1920&auto=format&fit=crop", // White dress
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1920&auto=format&fit=crop", // Summer dress
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1920&auto=format&fit=crop", // Fashion
  ],
  kurtas_ethnic: [
    "https://images.unsplash.com/photo-1583391733958-6c68253a18a9?q=80&w=1920&auto=format&fit=crop", // Ethnic 1
    "https://images.unsplash.com/photo-1598450123533-3113deaa8f88?q=80&w=1920&auto=format&fit=crop", // Ethnic 2
    "https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=1920&auto=format&fit=crop", // ethnic details
  ],
  accessories: [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1920&auto=format&fit=crop", // Sunglasses
    "https://images.unsplash.com/photo-1509941943102-10c232535736?q=80&w=1920&auto=format&fit=crop", // Glasses
  ],
  default: [
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1920&auto=format&fit=crop", // Fashion generic
    "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1920&auto=format&fit=crop", // Fashion generic 2
  ]
};

function getRandomImage(category, text) {
  const catLower = category.toLowerCase();
  const textLower = text.toLowerCase();
  
  let collection = unsplashImages.default;

  if (catLower.includes('men') || textLower.includes('shirt')) {
    collection = unsplashImages.mens_shirts;
  } else if (catLower.includes('women') || textLower.includes('dress') || textLower.includes('saree')) {
    collection = unsplashImages.womens_dresses;
  } else if (textLower.includes('kurta') || textLower.includes('ethnic')) {
    collection = unsplashImages.kurtas_ethnic;
  } else if (textLower.includes('glass') || textLower.includes('accessory')) {
    collection = unsplashImages.accessories;
  }

  // Pick random image from collection
  const mainImage = collection[Math.floor(Math.random() * collection.length)];
  
  // Create a gallery of 4 images by shuffling the collection
  const gallery = [...collection].sort(() => 0.5 - Math.random()).slice(0, 4);
  
  // If collection too small, pad with defaults
  while (gallery.length < 4) {
    gallery.push(unsplashImages.default[Math.floor(Math.random() * unsplashImages.default.length)]);
  }

  return { mainImage, images: gallery };
}

async function updateImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const products = await Product.find({});
    console.log(`Found ${products.length} products to update...`);

    let updatedCount = 0;

    for (const product of products) {
      const { mainImage, images } = getRandomImage(product.category, product.name + " " + (product.description || ""));
      
      product.image = mainImage;
      product.images = images;
      
      await product.save();
      updatedCount++;
      if (updatedCount % 10 === 0) console.log(`Updated ${updatedCount}...`);
    }

    console.log(`\n✅ Successfully updated ${updatedCount} products with Premium HD Unsplash images!`);
  } catch (error) {
    console.error("Error updating images:", error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
}

updateImages();
