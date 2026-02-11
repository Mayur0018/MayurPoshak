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

  useEffect(() => {
    if (product) {
      setTimeout(() => setLoading(false), 800); // simulate delay
    }
  }, [product]);

  const handleAddtoCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    dispatch(addToCart({ ...product, selectedSize }));
  };

  const sizes = ["SM", "MD", "LG", "XL"];

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
                  src={product.image}
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
              src={product.image}
              alt={product.name}
              width={400}
              height={500}
              className="w-full aspect-[3/4] object-cover object-top shadow-md hover:scale-105 transition-all duration-300"
            />
          </div>
        </div>

        {/* Details */}
        <div className="py-6 px-8 max-lg:max-w-2xl">
          <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
          <p className="text-sm text-slate-500 mt-2">Well-Versed Commerce</p>

          <div className="flex items-center space-x-1 mt-6">
            {[...Array(4)].map((_, idx) => (
              <svg key={idx} className="w-4 h-4 fill-slate-800" viewBox="0 0 14 13">
                <path d="M7 0L9.47 3.6L13.66 4.84L10.99 8.3L11.11 12.66L7 11.2L2.89 12.66L3.01 8.3L0.34 4.84L4.53 3.6L7 0Z" />
              </svg>
            ))}
            <svg className="w-4 h-4 fill-[#CED5D8]" viewBox="0 0 14 13">
              <path d="M7 0L9.47 3.6L13.66 4.84L10.99 8.3L11.11 12.66L7 11.2L2.89 12.66L3.01 8.3L0.34 4.84L4.53 3.6L7 0Z" />
            </svg>
            <button className="px-2.5 py-1.5 bg-slate-100 text-xs text-slate-900 rounded-md ml-4">
              87 Reviews
            </button>
          </div>

          <div className="mt-8 flex items-center flex-wrap gap-4">
            <p className="text-slate-900 text-4xl font-semibold">${product.price}</p>
            <p className="text-slate-400 text-sm mt-2 line-through">${product.price}</p>
            <span className="text-slate-400 text-sm mt-2">Tax included</span>
          </div>

          {/* Size Selector */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-slate-900">Choose a Size</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 border text-sm font-semibold rounded-full flex items-center justify-center 
                    ${selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-slate-900 hover:border-black"}`}
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

          {/* Description */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-slate-900">Product Description</h3>
            <p className="text-sm text-slate-500 mt-4">
              Elevate your casual style with our premium product. Crafted for comfort and designed
              with a modern fit, this versatile product is an essential addition to your wardrobe.
            </p>
            <ul className="list-disc mt-4 pl-4 text-sm text-slate-500 space-y-3">
              <li>Versatile and comfortable for everyday use.</li>
              <li>Available in multiple sizes for the perfect fit.</li>
              <li>Durable and easy to care for with machine wash compatibility.</li>
              <li>Great for customization with prints or embroidery.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
