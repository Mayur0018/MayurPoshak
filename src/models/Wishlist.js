import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Supabase User ID
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Ensure a user can only add a product to their wishlist once
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
