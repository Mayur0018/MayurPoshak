"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import { MdTrendingUp } from "react-icons/md";

const trendingTags = [
  { label: "Banarasi Saree", href: "/ladies", badge: "🔥", color: "var(--myntra-pink)" },
  { label: "Men Kurta", href: "/men", badge: "📈", color: "var(--flipkart-blue)" },
  { label: "Lehenga", href: "/ladies", badge: "💫", color: "#9C27B0" },
  { label: "Kids Dress", href: "/kids", badge: "🧒", color: "#E91E63" },
  { label: "Sherwani", href: "/men", badge: "👑", color: "var(--amazon-orange)" },
  { label: "Anarkali", href: "/ladies", badge: "✨", color: "var(--myntra-pink)" },
  { label: "Gen Z Fashion", href: "/genz", badge: "🤩", color: "#7C3AED" },
  { label: "Cotton Kurti", href: "/ladies", badge: "🌿", color: "var(--deal-green)" },
  { label: "Silk Saree", href: "/ladies", badge: "💎", color: "var(--amazon-orange)" },
  { label: "Party Wear", href: "/products", badge: "🎉", color: "var(--flipkart-blue)" },
  { label: "Wedding Collection", href: "/products", badge: "💍", color: "#D4A017" },
  { label: "Summer New Arrivals", href: "/products", badge: "☀️", color: "#FF5722" },
];

const popularSearches = [
  "saree under ₹999",
  "lehenga for wedding",
  "men kurta set",
  "kids ethnic wear",
  "designer kurti",
  "party wear gown",
];

export default function TrendingTags() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="py-8 px-4 md:px-9 bg-white">
      {/* Section Header */}
      <motion.div
        className="flex items-center gap-3 mb-5"
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <MdTrendingUp className="text-2xl" style={{ color: "var(--myntra-pink)" }} />
        <div>
          <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">
            Trending Right Now
          </h2>
          <p className="text-xs text-gray-400">
            What India is shopping — powered by Amazon, Myntra & Flipkart trends
          </p>
        </div>
      </motion.div>

      {/* Trending Tag Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {trendingTags.map((tag, i) => (
          <motion.div
            key={tag.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <Link
              href={tag.href}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200"
              style={{
                borderColor: hovered === i ? tag.color : "#e5e7eb",
                color: hovered === i ? tag.color : "#374151",
                background: hovered === i ? `${tag.color}0e` : "#fff",
                transform: hovered === i ? "translateY(-1px)" : "none",
                boxShadow: hovered === i ? `0 4px 12px ${tag.color}25` : "none",
              }}
            >
              <span>{tag.badge}</span>
              {tag.label}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Popular Searches */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          <IoSearchOutline className="inline mr-1.5 text-base" />
          Popular Searches
        </p>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((q, i) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/products?search=${encodeURIComponent(q)}`}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition font-medium"
              >
                <IoSearchOutline className="text-xs text-gray-300" />
                {q}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
