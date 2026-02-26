"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

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
   CategoryFilter
========================= */
const CategoryFilter = ({ value, onChange }) => {
  const categories = [
    { id: "boys", label: "Boys" },
    { id: "girls", label: "Girls" },
    { id: "infants", label: "Infants" },
  ];

  return (
    <FilterSection title="Category">
      <div className="flex flex-col gap-3">
        {categories.map((c) => (
          <label key={c.id} className="flex gap-2 items-center text-sm">
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
            {c.label}
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
  const colors = ["red", "blue", "yellow", "black", "pink", "white"];

  return (
    <FilterSection title="Color">
      <div className="flex flex-wrap gap-2">
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
            title={c}
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
  const sizes = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"];

  return (
    <FilterSection title="Size">
      <div className="grid grid-cols-2 gap-2">
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
            className={`px-3 py-1 text-xs border rounded ${
              value.includes(s)
                ? "border-black bg-gray-100"
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
   FilterSidebar
========================= */
const FilterSidebar = ({ filters, setFilters }) => (
  <aside className="w-[220px] shrink-0">
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
   Page
========================= */
export default function KidsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: [],
    color: [],
    size: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/products?category=kids`;
        if (filters.category.length > 0) {
          filters.category.forEach(c => url += `&subCategory=${c}`);
        }
        if (filters.color.length > 0) {
          filters.color.forEach(c => url += `&color=${encodeURIComponent(c)}`);
        }
        if (filters.size.length > 0) {
          filters.size.forEach(s => url += `&size=${s}`);
        }
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-5 py-10 flex gap-10 max-md:flex-col">
        <FilterSidebar filters={filters} setFilters={setFilters} />

        <main className="flex-1">
          <h1 className="mb-6 text-3xl font-semibold text-gray-900 border-b pb-4">
            Kids' Collection
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : products.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link key={product._id} href={`/product/${product._id}`}>
                  <div className="group relative border border-gray-100 rounded-xl overflow-hidden hover:shadow-2xl hover:border-gray-200 transition-all duration-300 cursor-pointer h-full flex flex-col">
                    <div className="w-full aspect-[3/4] bg-gray-50 overflow-hidden relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      />
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
                      <button className="mt-4 w-full py-2 bg-black text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Quick View
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-xl text-gray-500">No products found matching your filters.</h2>
              <button 
                onClick={() => setFilters({category: [], color: [], size: []})}
                className="mt-4 text-black underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
