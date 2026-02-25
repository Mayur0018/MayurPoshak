import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import MostTrending from "@/components/MostTrending";
import About from "@/components/About";
import ProductOffer from "@/components/ProductOffer";
import Exhibition from "@/components/Exhibition";
import Link from "next/link";

export default async function Home() {
  let products = [];
  try {
    await connectDB();
    products = await Product.find().lean();
  } catch (error) {
    console.error("Error fetching products on Home:", error);
  }

  function cardImage(p) {
    return p.image ?? null;
  }

  return (
    <>
      <main>
        <div className="max-w-[1920px] mx-auto">
          <Hero />
          <Categories />
          <MostTrending />
          <ProductOffer />
          <About />
          <Exhibition/>
          <div className="px-4 sm:px-6 lg:px-8 mt-10">
            <h2 className="text-xl font-semibold mb-4">Latest Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(products ?? []).map((p, idx) => {
                const img = cardImage(p);
                return (
                  <Link key={p._id || `${p.name}-${idx}`} href={`/product/${p._id}`} className="border rounded bg-white overflow-hidden">
                    {img && <img src={img} alt={p.name} className="w-full h-40 object-cover" />}
                    <div className="p-3">
                      <div className="text-sm font-semibold truncate">{p.name}</div>
                      <div className="mt-1">
                        <span className="text-green-600 font-bold">₹{Number(p.price ?? 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
