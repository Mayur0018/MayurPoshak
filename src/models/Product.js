import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., 'men', 'women', 'kids'
  subCategory: { type: String }, // e.g., 'classicsarees', 'cotton', 'formal'
  brand: { type: String },
  size: [String], // Array of sizes like ['S', 'M', 'L']
  color: [String], // Array of colors like ['black', 'red']
  stock: { type: Number, default: 10 },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
