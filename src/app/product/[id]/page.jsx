import ProductDetails from "@/components/ProductDetails";
import { FaShoppingCart } from "react-icons/fa";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function ProductPage({ params }) {
  const { id } = await params;
  
  if (!id || typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-red-500 gap-4">
        <FaShoppingCart className="text-5xl" />
        <p className="text-xl font-bold">Invalid Product ID</p>
      </div>
    );
  }

  let product = null;
  try {
    await connectDB();
    const data = await Product.findById(id).lean();
    if (data) {
      // Mongoose .lean() still returns ObjectId for _id, convert to string for React
      product = JSON.parse(JSON.stringify(data));
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-red-500 gap-4">
        <FaShoppingCart className="text-5xl" />
        <p className="text-xl font-bold">Product Not Found</p>
      </div>
    );
  }

  return <ProductDetails product={product} />
}
