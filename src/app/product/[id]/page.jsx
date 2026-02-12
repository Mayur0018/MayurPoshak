import ProductDetails from "@/components/ProductDetails";
import { FaShoppingCart } from "react-icons/fa"; // 🛒 Shopping cart icon

export default async function ProductPage({ params}) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}`, {
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

  return <ProductDetails product={product} />
}
