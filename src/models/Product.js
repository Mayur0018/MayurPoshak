import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
