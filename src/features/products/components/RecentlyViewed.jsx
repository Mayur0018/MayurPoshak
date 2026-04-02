"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const RecentlyViewed = ({ currentProductId }) => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    // Filter out the current product from the display list
    setRecentProducts(products.filter(p => p.id !== currentProductId).slice(0, 8));
  }, [currentProductId]);

  if (recentProducts.length === 0) return null;

  return (
    <div className="mt-20 border-t border-gray-100 pt-16 px-4 md:px-8 max-w-[1920px] mx-auto overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 font-playfair tracking-tight">
            Recently Viewed
          </h3>
          <p className="text-sm text-gray-400 mt-2 font-medium tracking-wide">CONTINUE WHERE YOU LEFT OFF</p>
        </div>
        <Link 
          href="/men" 
          className="group flex items-center gap-2 text-sm font-bold text-black border-b-2 border-black pb-1 hover:border-gray-300 transition-all"
        >
          EXPLORE MORE
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      <div className="flex gap-4 md:gap-7 overflow-x-auto pb-10 scrollbar-hide -mx-4 px-4 no-scrollbar">
        {recentProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="flex-shrink-0 w-[180px] md:w-[240px] group cursor-pointer"
          >
            <Link href={`/product/${product.id}`}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 mb-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-700">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                
                {/* Micro-interaction badge */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
                   <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-black shadow-sm">
                      QUICK VIEW
                   </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-[15px] font-bold text-gray-800 truncate group-hover:text-black transition-colors uppercase tracking-tight">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] text-gray-900 font-black">₹{product.price}</p>
                  <p className="text-[12px] text-gray-400 line-through">₹{Math.round(product.price * 1.5)}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RecentlyViewed;
