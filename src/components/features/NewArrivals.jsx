"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const NewArrivals = ({ products = [] }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-1 font-medium">
              Just Dropped
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold uppercase tracking-widest border-b-2 border-black pb-0.5 hover:text-gray-500 hover:border-gray-400 transition"
          >
            View All →
          </Link>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {products.map((p, idx) => {
            const img = p.image ?? null;
            const id = p._id?.toString() ?? idx;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="group"
              >
                <Link href={`/product/${id}`} className="block">
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[3/4]">
                    {img ? (
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                    {/* NEW badge */}
                    <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      New
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-gray-500 transition truncate">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-base font-bold text-gray-900">
                        ₹{Number(p.price ?? 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Quick Add */}
                <button
                  className="mt-3 w-full py-2 bg-black text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  onClick={() => {
                    window.location.href = `/product/${id}`;
                  }}
                >
                  SHOP NOW
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
