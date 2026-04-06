"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdLocalOffer, MdContentCopy, MdCheck } from "react-icons/md";

const offers = [
  {
    id: 1,
    code: "FIRST10",
    title: "10% off your first order",
    desc: "New customers only",
    color: "var(--amazon-orange)",
    bg: "var(--amazon-orange-light)",
    icon: "🎁",
  },
  {
    id: 2,
    code: "MYNTRA50",
    title: "Flat ₹500 off on ₹1999+",
    desc: "On all fashion categories",
    color: "var(--myntra-pink)",
    bg: "var(--myntra-pink-light)",
    icon: "💃",
  },
  {
    id: 3,
    code: "FLIPDEAL",
    title: "Free delivery on any order",
    desc: "No minimum order value",
    color: "var(--flipkart-blue)",
    bg: "var(--flipkart-blue-light)",
    icon: "🚀",
  },
  {
    id: 4,
    code: "HDFC10",
    title: "Extra 10% off with HDFC Card",
    desc: "On transactions above ₹2000",
    color: "#5C6BC0",
    bg: "#EDF0FF",
    icon: "🏦",
  },
  {
    id: 5,
    code: "WELCOME20",
    title: "20% off for new signups",
    desc: "Valid on all categories",
    color: "var(--deal-green)",
    bg: "rgba(56,142,60,0.08)",
    icon: "✨",
  },
];

function CouponCard({ offer }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3, boxShadow: "0 8px 25px -10px rgba(0,0,0,0.12)" }}
      className="flex-shrink-0 w-[220px] rounded-2xl overflow-hidden relative border"
      style={{ borderColor: `${offer.color}22`, background: offer.bg }}
    >
      {/* Top colored strip */}
      <div className="h-1 w-full" style={{ background: offer.color }} />

      <div className="p-4">
        <span className="text-2xl mb-2 block">{offer.icon}</span>
        <p className="text-xs font-black text-gray-800 leading-snug">{offer.title}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 mb-3">{offer.desc}</p>

        {/* Code + Copy */}
        <div
          className="flex items-center justify-between gap-2 border-2 border-dashed rounded-lg px-2.5 py-1.5"
          style={{ borderColor: `${offer.color}50` }}
        >
          <span className="text-xs font-black tracking-widest" style={{ color: offer.color }}>
            {offer.code}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] font-bold transition-all"
            style={{ color: offer.color }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <MdCheck className="text-sm" /> Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <MdContentCopy className="text-sm" /> Copy
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function OfferStrip() {
  return (
    <section className="py-8 px-4 md:px-9 bg-white">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-5"
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <MdLocalOffer className="text-2xl" style={{ color: "var(--myntra-pink)" }} />
          <div>
            <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">
              Coupons & Offers
            </h2>
            <p className="text-xs text-gray-400">Click to copy coupon code</p>
          </div>
        </div>
        {/* Gradient chips */}
        <div className="hidden sm:flex gap-2">
          {["Amazon", "Myntra", "Flipkart"].map((b, i) => (
            <span
              key={b}
              className="text-[10px] font-black px-3 py-1 rounded-full text-white"
              style={{
                background: [
                  "var(--amazon-orange)",
                  "var(--myntra-pink)",
                  "var(--flipkart-blue)",
                ][i],
              }}
            >
              {b} Style
            </span>
          ))}
        </div>
      </motion.div>

      {/* Coupon Cards */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
        {offers.map((offer) => (
          <div key={offer.id} className="snap-start shrink-0">
            <CouponCard offer={offer} />
          </div>
        ))}
      </div>

      {/* Bottom info bar */}
      <motion.div
        className="mt-4 flex flex-wrap gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        {[
          { icon: "💳", text: "All major bank offers available" },
          { icon: "📦", text: "COD available on all orders" },
          { icon: "🔒", text: "100% secure checkout" },
          { icon: "🎁", text: "Gift cards accepted" },
        ].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 font-medium bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full"
          >
            {item.icon} {item.text}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
