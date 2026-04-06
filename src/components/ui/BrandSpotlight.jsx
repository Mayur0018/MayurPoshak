"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const brands = [
  { name: "Sabyasachi", tag: "Couture", emoji: "👑", color: "var(--amazon-orange)", href: "/products" },
  { name: "Fabindia", tag: "Heritage", emoji: "🌿", color: "var(--deal-green)", href: "/products" },
  { name: "W for Woman", tag: "Modern", emoji: "✨", color: "var(--myntra-pink)", href: "/ladies" },
  { name: "Manyavar", tag: "Ethnic Men", emoji: "🕌", color: "var(--flipkart-blue)", href: "/men" },
  { name: "Biba", tag: "Casual", emoji: "🌸", color: "#9C27B0", href: "/ladies" },
  { name: "Global Desi", tag: "Boho", emoji: "🦋", color: "#FF5722", href: "/ladies" },
  { name: "Raymond", tag: "Formal", emoji: "💼", color: "#37474F", href: "/men" },
  { name: "Kids Craft", tag: "Kids Wear", emoji: "🧒", color: "#E91E63", href: "/kids" },
];

const platformBadges = [
  { name: "Amazon Recommended", color: "var(--amazon-orange)", icon: "🅰️" },
  { name: "Myntra Favourites", color: "var(--myntra-pink)", icon: "M" },
  { name: "Flipkart Assured", color: "var(--flipkart-blue)", icon: "F" },
];

export default function BrandSpotlight() {
  return (
    <section className="py-10 px-4 md:px-9 bg-white border-y border-gray-100">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-medium mb-1">
            Curated For You
          </p>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
            Top Brands Spotlight
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Discover trusted brands — as featured on Amazon, Myntra & Flipkart
          </p>
        </div>

        {/* Platform Badges */}
        <div className="flex gap-2 flex-wrap">
          {platformBadges.map((b) => (
            <span
              key={b.name}
              className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full text-white shadow-sm"
              style={{ background: b.color }}
            >
              <span className="font-black text-[11px]">{b.icon}</span> {b.name}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Brand Chips Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {brands.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Link
              href={brand.href}
              className="flex flex-col items-center gap-2 group"
            >
              {/* Circle Avatar */}
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  background: `${brand.color}12`,
                  border: `2px solid ${brand.color}25`,
                }}
              >
                {brand.emoji}
              </div>
              <div className="text-center">
                <p className="text-[11px] md:text-xs font-black text-gray-800 leading-tight group-hover:text-gray-500 transition">
                  {brand.name}
                </p>
                <p
                  className="text-[9px] font-bold uppercase tracking-wider mt-0.5"
                  style={{ color: brand.color }}
                >
                  {brand.tag}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <motion.div
        className="mt-7 rounded-2xl overflow-hidden relative p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          background: "linear-gradient(135deg, var(--flipkart-blue) 0%, var(--myntra-pink) 55%, var(--amazon-orange) 100%)",
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-20 w-20 h-20 rounded-full bg-white/5 translate-y-8" />

        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 mb-1">
            Exclusive Partnership
          </p>
          <h3 className="text-lg md:text-xl font-black leading-tight">
            Shop Like Amazon · Style Like Myntra
            <br />
            <span className="text-white/80">Save Like Flipkart</span>
          </h3>
        </div>

        <Link
          href="/products"
          className="relative z-10 shrink-0 bg-white text-gray-900 text-sm font-black px-6 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg"
        >
          Explore All Brands →
        </Link>
      </motion.div>
    </section>
  );
}
