import ProductDetails from "@/components/ProductDetails";
import { FaShoppingCart } from "react-icons/fa"; // 🛒 Shopping cart icon
import { headers } from "next/headers";

export default async function ProductPage({ params}) {
  const { id } = await params;
  const envBase = process.env.NEXT_PUBLIC_API_URL ? String(process.env.NEXT_PUBLIC_API_URL).replace(/\/$/, "") : null;
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host") || "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") || "http";
  const origin = `${proto}://${host}`;
  const urls = [
    envBase ? new URL(`/${id}`, envBase + "/").toString() : null,
    new URL(`/api/products/${id}`, origin).toString(),
  ].filter(Boolean);
  let product = null;
  for (const u of urls) {
    const res = await fetch(u, { cache: "no-store" });
    if (res.ok) {
      product = await res.json();
      break;
    }
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
