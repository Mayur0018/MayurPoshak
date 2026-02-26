"use client";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";

/* =========================
   FilterSection
========================= */
const FilterSection = ({ title, children }) => (
  <section className="my-8">
    <header className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <i className="ti ti-chevron-up text-base text-gray-500" />
    </header>
    {children}
  </section>
);

/* =========================
   CategoryFilter
========================= */
const CategoryFilter = ({ value, onChange }) => {
  const categories = [
    { id: "classicsarees", label: "Classic Sarees" },
    { id: "cotton", label: "Cotton Wear" },
    { id: "formal", label: "Formal Wear" },
  ];

  return (
    <FilterSection title="Category">
      <div className="flex flex-col gap-3">
        {categories.map((c) => (
          <label key={c.id} className="flex gap-2 items-center">
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
            />
            <span className="text-sm">{c.label}</span>
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
  const colors = ["black", "#8B6F47", "#1e3a8a"];

  return (
    <FilterSection title="Color">
      <div className="flex gap-3">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() =>
              onChange(
                value.includes(c)
                  ? value.filter((v) => v !== c)
                  : [...value, c]
              )
            }
            className={`w-7 h-7 rounded-full border-2 ${
              value.includes(c) ? "border-black" : "border-gray-300"
            }`}
            style={{ backgroundColor: c }}
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
  const sizes = ["S", "M", "L", "XL"];

  return (
    <FilterSection title="Size">
      <div className="grid grid-cols-4 gap-2">
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
            className={`px-3 py-1 text-sm border rounded ${
              value.includes(s)
                ? "border-black bg-gray-100"
                : "border-gray-300"
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
   FilterSidebar
========================= */
const FilterSidebar = ({ filters, setFilters }) => (
  <aside className="w-[200px]">
    <CategoryFilter
      value={filters.category}
      onChange={(v) => setFilters({ ...filters, category: v })}
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
);

/* =========================
   ProductCard
========================= */
const ProductCard = ({ product }) => {
  return (
    <Link href={`/product/${product._id}`}>
      <div className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-2xl hover:border-gray-200 transition-all duration-500 cursor-pointer h-full flex flex-col">
        <div className="w-full aspect-[3/4] bg-gray-50 overflow-hidden relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 text-gray-900">
                <i className="ti ti-heart text-lg" />
             </button>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition truncate">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
             <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
             <div className="flex gap-1">
                {product.color && product.color.slice(0, 3).map((c, i) => (
                    <div key={i} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                ))}
             </div>
          </div>
          <button className="mt-4 w-full py-2.5 bg-black text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            VIEW DETAILS
          </button>
        </div>
      </div>
    </Link>
  );
};

/* =========================
   Page
========================= */
import { useEffect as useEff } from 'react'; // Using alias to avoid conflict if I add more imports
import Link from "next/link";

export default function MenPage() {
  const [filters, setFilters] = useState({
    category: [],
    color: [],
    size: [],
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/products?category=men`;
        if (filters.category.length > 0) {
          filters.category.forEach(cat => url += `&subCategory=${cat}`);
        }
        if (filters.color.length > 0) {
          filters.color.forEach(col => url += `&color=${encodeURIComponent(col)}`);
        }
        if (filters.size.length > 0) {
          filters.size.forEach(sz => url += `&size=${sz}`);
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
    setFilters({ category: [], color: [], size: [] });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* BANNER SECTION */}
      <section className="relative w-full h-80 md:h-[450px] overflow-hidden">
        <Image
          src="/Classic/classicsarees.jpg"
          alt="Men's Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-4">MEN&apos;S COUTURE</h1>
            <p className="text-lg md:text-xl font-medium uppercase tracking-[0.2em]">Exquisite Classic Collection</p>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-5 py-16 flex gap-12 max-md:flex-col">
        <aside className="w-[240px] shrink-0">
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
             <h2 className="text-xl font-bold uppercase tracking-wider">Filters</h2>
             {(filters.category.length > 0 || filters.color.length > 0 || filters.size.length > 0) && (
               <button onClick={clearFilters} className="text-xs text-red-600 font-bold hover:underline">CLEAR ALL</button>
             )}
          </div>
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </aside>
        
        <main className="flex-1">
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                Showing {products.length} Products
             </h2>
             <div className="text-sm text-gray-500 font-medium">
                Home / Men / Classics
             </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : products.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </section>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <h2 className="text-xl font-semibold text-gray-500 mb-4">Luxury awaits. No items match your selection.</h2>
              <button onClick={clearFilters} className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition">
                RESET FILTERS
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
