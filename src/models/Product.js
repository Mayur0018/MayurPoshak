import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true }, // Main cover image
  images: [String], // Array of additional product images/angles
  price: { type: Number, required: true }, // Selling Price
  mrp: { type: Number }, // Original Price for discount display
  category: { type: String, required: true },
  subCategory: { type: String },
  brand: { type: String, default: "Mayur Poshak" },
  highlights: [String], // Key selling points
  specifications: {
    type: Map,
    of: String
  }, // Dynamic key-value pairs (e.g., Fabric: Silk, Work: Zari)
  size: [String],
  color: [String],
  stock: { type: Number, default: 10 },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 12 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
