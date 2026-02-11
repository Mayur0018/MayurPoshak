import ProductDetails from "@/components/ProductDetails";
import { FaShoppingCart } from "react-icons/fa"; // 🛒 Shopping cart icon

export default async function ProductPage({ params}) {
  const { id } = await params;
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-red-500 gap-4">
          <FaShoppingCart className="text-5xl" />
          <p className="text-xl font-bold">Product Not Found</p>
        </div>
      );
    }

    const product = await res.json();

    return <ProductDetails product={product} />;
  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <FaShoppingCart className="text-5xl text-red-500" />
        <p className="text-xl font-bold">Failed to load product</p>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }
}
