"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import toast, { Toaster } from "react-hot-toast";

/* =========================
   FilterSection
========================= */
const FilterSection = ({ title, children }) => (
  <section className="my-8">
    <header className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    </header>
    {children}
  </section>
);

/* =========================
   SubCategoryFilter
========================= */
const SubCategoryFilter = ({ value, onChange }) => {
  const subs = [
    { id: "hoodies", label: "Hoodies" },
    { id: "pants", label: "Pants & Joggers" },
    { id: "tshirts", label: "T-Shirts" },
    { id: "jackets", label: "Jackets" },
    { id: "jeans", label: "Jeans" },
    { id: "sweatshirts", label: "Sweatshirts" },
    { id: "shirts", label: "Shirts" },
    { id: "shorts", label: "Shorts" },
  ];

  return (
    <FilterSection title="Style">
      <div className="flex flex-col gap-3">
        {subs.map((c) => (
          <label key={c.id} className="flex gap-2 items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={value.includes(c.id)}
              onChange={() =>
                onChange(
                  value.includes(c.id)
                    ? value.filter((v) => v !== c.id)
                    : [...value, c.id]
                )
              }
              className="accent-black"
            />
            <span className="text-sm group-hover:text-black transition">
              {c.label}
            </span>
          </label>
        ))}
      </div>
    </FilterSection>
  );
};

/* =========================
   ColorFilter
========================= */
const ColorFilter = ({ value, onChange }) => {
  const colors = [
    { name: "black", hex: "#000000" },
    { name: "white", hex: "#ffffff" },
    { name: "blue", hex: "#1e3a8a" },
    { name: "beige", hex: "#d4b896" },
    { name: "gray", hex: "#6b7280" },
    { name: "green", hex: "#166534" },
    { name: "red", hex: "#dc2626" },
    { name: "navy", hex: "#1e3a5f" },
    { name: "pink", hex: "#ec4899" },
  ];

  return (
    <FilterSection title="Color">
      <div className="flex flex-wrap gap-3">
        {colors.map((c) => (
          <button
            key={c.name}
            title={c.name}
            onClick={() =>
              onChange(
                value.includes(c.name)
                  ? value.filter((v) => v !== c.name)
                  : [...value, c.name]
              )
            }
            className={`w-7 h-7 rounded-full border-2 transition-all ${
              value.includes(c.name)
                ? "border-black scale-110 ring-2 ring-black/20"
                : "border-gray-300 hover:border-gray-400"
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
    </FilterSection>
  );
};

/* =========================
   SizeFilter
========================= */
const SizeFilter = ({ value, onChange }) => {
  const sizes = ["S", "M", "L", "XL", "XXL", "Free Size"];

  return (
    <FilterSection title="Size">
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() =>
              onChange(
                value.includes(s)
                  ? value.filter((v) => v !== s)
                  : [...value, s]
              )
            }
            className={`px-2 py-1.5 text-xs font-medium border rounded-md transition-all ${
              value.includes(s)
                ? "border-black bg-black text-white"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </FilterSection>
  );
};

/* =========================
   ProductCard
========================= */
const ProductCard = ({ product, index }) => {
  const dispatch = useDispatch();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/product/${product._id}`}>
        <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-gray-200 transition-all duration-500 cursor-pointer h-full flex flex-col">
          <div className="w-full aspect-[3/4] bg-gray-50 overflow-hidden relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            {/* Badge */}
            <div className="absolute top-3 left-3">
              <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Gen Z
              </span>
            </div>
            {/* Wishlist */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white text-gray-900">
                <i className="ti ti-heart text-lg" />
              </button>
            </div>
          </div>
          <div className="p-5 flex flex-col flex-1">
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mb-1">
              {product.brand}
            </p>
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-black transition truncate">
              {product.name}
            </h3>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
              <div className="flex gap-1">
                {product.color &&
                  product.color.slice(0, 3).map((c, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: c }}
                    />
                  ))}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch(addToCart(product));
                toast.success("Added to cart!");
              }}
              className="mt-4 w-full py-2.5 bg-black text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-800"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* =========================
   GenZ Page
========================= */
export default function GenZPage() {
  const [filters, setFilters] = useState({
    subCategory: [],
    color: [],
    size: [],
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/products?category=genz`;
        if (filters.subCategory.length > 0) {
          filters.subCategory.forEach((sub) => (url += `&subCategory=${sub}`));
        }
        if (filters.color.length > 0) {
          filters.color.forEach(
            (col) => (url += `&color=${encodeURIComponent(col)}`)
          );
        }
        if (filters.size.length > 0) {
          filters.size.forEach((sz) => (url += `&size=${sz}`));
        }
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const clearFilters = () => {
    setFilters({ subCategory: [], color: [], size: [] });
  };

  const hasActiveFilters =
    filters.subCategory.length > 0 ||
    filters.color.length > 0 ||
    filters.size.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" reverseOrder={false} />

      {/* ─── HERO BANNER ─── */}
      <section className="relative w-full h-80 md:h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1920&q=80&fit=crop"
          alt="Gen Z Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center pb-16">
          <motion.div
            className="text-center text-white px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm md:text-base font-medium uppercase tracking-[0.3em] mb-3 text-white/80">
              New Drop
            </p>
            <h1 className="text-4xl md:text-7xl font-light tracking-tighter mb-4">
              GEN Z COLLECTION
            </h1>
            <p className="text-base md:text-xl font-medium uppercase tracking-[0.15em] text-white/90">
              Baggy • Oversized • Streetwear
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <div className="max-w-[1400px] mx-auto px-5 py-16 flex gap-12 max-md:flex-col">
        {/* Sidebar */}
        <aside className="w-[240px] shrink-0">
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
            <h2 className="text-xl font-bold uppercase tracking-wider">
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                CLEAR ALL
              </button>
            )}
          </div>
          <SubCategoryFilter
            value={filters.subCategory}
            onChange={(v) => setFilters({ ...filters, subCategory: v })}
          />
          <ColorFilter
            value={filters.color}
            onChange={(v) => setFilters({ ...filters, color: v })}
          />
          <SizeFilter
            value={filters.size}
            onChange={(v) => setFilters({ ...filters, size: v })}
          />
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              Showing {products.length} Products
            </h2>
            <div className="text-sm text-gray-500 font-medium">
              Home / Gen Z / Baggy
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
            </div>
          ) : products.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </section>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <h2 className="text-xl font-semibold text-gray-500 mb-2">
                No products match your filters
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Try removing some filters to see more items
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition"
              >
                RESET FILTERS
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
