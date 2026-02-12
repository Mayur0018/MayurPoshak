"use client";

import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import Link from "next/link";
import { useEffect, useState } from "react";

// ✅ Simple shimmer block
const Shimmer = ({ className }) => (
  <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
);

export default function ProductDetails({ product }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);

  /* =========================
     🔒 SAFETY GUARD (MAIN FIX)
  ========================= */
  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">
        Product not found
      </div>
    );
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAddtoCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    dispatch(addToCart({ ...product, selectedSize }));
  };

  const sizes = ["SM", "MD", "LG", "XL"];

  /* =========================
     🔒 SAFE IMAGE SOURCE
  ========================= */
  const safeImage =
    product.image ||
    "/placeholder.png"; // keep a placeholder in /public

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid items-start grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 grid grid-cols-2 gap-2">
            <Shimmer className="aspect-[253/337] h-80 w-full" />
            <Shimmer className="aspect-[3/4] h-80 w-full" />
          </div>
          <div className="space-y-4 px-6">
            <Shimmer className="h-6 w-3/4" />
            <Shimmer className="h-4 w-1/2" />
            <Shimmer className="h-10 w-32" />
            <Shimmer className="h-10 w-full" />
            <Shimmer className="h-10 w-full" />
            <Shimmer className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 py-20">
      <div className="grid items-start grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Images */}
        <div className="col-span-2 grid grid-cols-2 lg:sticky top-0 gap-1">
          <div className="columns-2 gap-1 space-y-1">
            {[...Array(4)].map((_, idx) => (
              <div className="overflow-hidden" key={idx}>
                <Image
                  src={safeImage}
                  alt={product.name}
                  width={400}
                  height={500}
                  className="w-full aspect-[253/337] object-cover object-top shadow-md hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>

          <div className="overflow-hidden">
            <Image
              src={safeImage}
              alt={product.name}
              width={400}
              height={500}
              className="w-full aspect-[3/4] object-cover object-top shadow-md hover:scale-105 transition-all duration-300"
            />
          </div>
        </div>

        {/* Details */}
        <div className="py-6 px-8 max-lg:max-w-2xl">
          <h2 className="text-xl font-semibold text-slate-900">
            {product.name}
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Well-Versed Commerce
          </p>

          <div className="mt-8 flex items-center flex-wrap gap-4">
            <p className="text-slate-900 text-4xl font-semibold">
              ₹{product.price}
            </p>
            <p className="text-slate-400 text-sm mt-2 line-through">
              ₹{product.price}
            </p>
            <span className="text-slate-400 text-sm mt-2">
              Tax included
            </span>
          </div>

          {/* Size Selector */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-slate-900">
              Choose a Size
            </h3>

            <div className="flex flex-wrap gap-4 mt-4">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 border text-sm font-semibold rounded-full flex items-center justify-center 
                    ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-slate-900 hover:border-black"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 space-y-4">
            <button
              className="w-full px-4 py-2.5 border border-slate-800 bg-transparent hover:bg-slate-50 text-slate-900 text-sm font-medium rounded-md"
              onClick={handleAddtoCart}
            >
              Add to cart
            </button>

            <Link href="/cart">
              <button className="w-full px-4 py-2.5 border border-slate-800 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-md">
                Buy now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
