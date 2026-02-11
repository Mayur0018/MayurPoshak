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
   CategoryFilter (KIDS)
========================= */
const CategoryFilter = ({ value, onChange }) => {
  const categories = [
    { id: "tshirts", label: "T-Shirts" },
    { id: "hoodies", label: "Hoodies" },
    { id: "sets", label: "Clothing Sets" },
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
  const colors = ["red", "blue", "yellow", "black"];

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
   SizeFilter (KIDS)
========================= */
const SizeFilter = ({ value, onChange }) => {
  const sizes = ["2-3Y", "4-5Y", "6-7Y", "8-9Y"];

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
    <article className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition">
      <div className="relative w-full h-96">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium">{product.name}</h3>
        <p className="text-red-600 font-semibold mt-2">₹{product.price}</p>
      </div>
    </article>
  );
};

/* =========================
   Page
========================= */
export default function KidsPage() {
  const [filters, setFilters] = useState({
    category: [],
    color: [],
    size: [],
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* BANNER SECTION */}
      <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <Image
          src="/Summer/summersarees.jpg"
          alt="Kids Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Kids Corner</h1>
            <p className="text-lg md:text-xl">Fun and colorful collection for your little ones</p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-[1400px] mx-auto px-5 py-10 flex gap-10 max-md:flex-col">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        
        <main className="flex-1">
          <h1 className="mb-6 text-3xl font-semibold">Kids' Clothing Collection</h1>

          {products.length > 0 ? (
            <section className="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
              {products.slice(0, 9).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </section>
          ) : (
            <p className="text-gray-500 text-center py-12">Loading products...</p>
          )}
        </main>
      </div>
    </div>
  );
}
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
  const [activeColor, setActiveColor] = useState(product.colors[0]);

  return (
    <article className="bg-gray-100 rounded-lg overflow-hidden">
      <img
        src={product.images[activeColor]}
        alt={product.name}
        className="w-full h-[400px] object-cover"
      />

      <div className="p-4">
        <h3 className="text-sm font-medium">{product.name}</h3>

        <div className="flex gap-2 text-sm my-1">
          <span className="line-through text-gray-400">
            ${product.originalPrice}
          </span>
          <span className="font-semibold">
            ${product.salePrice}
          </span>
        </div>

        <div className="flex gap-2 mt-3">
          {product.colors.map((c) => (
            <button
              key={c}
              onClick={() => setActiveColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${
                activeColor === c ? "border-black" : "border-gray-300"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </article>
  );
};

/* =========================
   ProductGrid (KIDS)
========================= */
const ProductGrid = ({ filters }) => {
  const products = [
    {
      id: 1,
      name: "Kids Graphic T-Shirt",
      category: "tshirts",
      colors: ["red", "blue", "black"],
      sizes: ["4-5Y", "6-7Y"],
      originalPrice: 80,
      salePrice: 55,
      images: {
        red: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800",
        blue: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
        black: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      },
    },
    {
      id: 2,
      name: "Kids Hoodie Set",
      category: "sets",
      colors: ["yellow", "blue"],
      sizes: ["6-7Y", "8-9Y"],
      originalPrice: 120,
      salePrice: 90,
      images: {
        yellow: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800",
        blue: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      },
    },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.category.length && !filters.category.includes(p.category))
        return false;
      if (filters.color.length && !filters.color.some((c) => p.colors.includes(c)))
        return false;
      if (filters.size.length && !filters.size.some((s) => p.sizes.includes(s)))
        return false;
      return true;
    });
  }, [filters]);

  return (
    <main className="flex-1">
      <h1 className="mb-6 text-3xl font-semibold">
        Kids' Clothing & Apparel
      </h1>

      <section className="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
    </main>
  );
};

/* =========================
   Page
========================= */
export default function KidsPage() {
  const [filters, setFilters] = useState({
    category: [],
    color: [],
    size: [],
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-5 py-10 flex gap-10 max-md:flex-col">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        <ProductGrid filters={filters} />
      </div>
    </div>
  );
}
