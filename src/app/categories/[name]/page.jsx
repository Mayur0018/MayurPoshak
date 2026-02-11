"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { category } from "@/Data/Category";

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode category name from URL
  const categoryName = decodeURIComponent(params.name)
    .replace(/-/g, " ")
    .toUpperCase();

  useEffect(() => {
    // Find category info from the category data
    const foundCategory = category.find(
      (cat) => cat.text.toUpperCase() === categoryName
    );
    setCategoryInfo(foundCategory);

    // Fetch all products
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        // Filter products by category name (based on product name or custom filtering)
        // For now, we'll return all products; in production, you might filter by category field
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden mb-8">
        {categoryInfo && (
          <Image
            src={categoryInfo.Image}
            alt={categoryInfo.text}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              {categoryName}
            </h1>
            <p className="text-lg md:text-xl">
              Explore our exclusive collection
            </p>
          </div>
        </div>
      </div>

      {/* Header with breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link href="#" className="hover:text-black">
            Categories
          </Link>
          <span>/</span>
          <span className="text-black font-medium">{categoryName}</span>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {categoryName} Collection
          </h2>
          <p className="text-gray-600">
            Discover our curated selection of {categoryName.toLowerCase().replace(/ SAREES/, "")} sarees
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Link
                key={product._id || index}
                href={`/product/${product._id}`}
              >
                <div className="group relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition cursor-pointer h-full bg-white">
                  {/* Product Image */}
                  <div className="relative bg-gray-100 overflow-hidden h-64">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-red-600 transition mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <p className="text-lg md:text-xl font-bold text-gray-900">
                        ₹{product.price}
                      </p>
                      <button className="px-3 py-1 bg-black text-white text-xs rounded-full hover:bg-gray-800 transition opacity-0 group-hover:opacity-100">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 mb-4">
              No products found in this category
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>

      {/* CTA Section */}
      {products.length > 0 && (
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Explore our full collection or contact us for personalized assistance
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
              >
                Back to Home
              </Link>
              <Link
                href="/Contact"
                className="px-8 py-3 border border-black text-black rounded-full font-medium hover:bg-gray-100 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
