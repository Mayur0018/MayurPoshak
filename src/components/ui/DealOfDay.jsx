"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MdLocalOffer, MdTimer } from "react-icons/md";
import { FaFire, FaStar } from "react-icons/fa";
import { BsLightningFill } from "react-icons/bs";

/* ── Deal Products ── */
const deals = [
  {
    id: 1,
    title: "Banarasi Pure Silk Saree",
    subtitle: "Royal Weave Collection",
    originalPrice: 8999,
    dealPrice: 3999,
    discount: 56,
    rating: 4.7,
    reviews: 2341,
    stock: 12,
    totalStock: 50,
    badge: "DEAL OF THE DAY",
    badgeColor: "var(--amazon-orange)",
    tag: "🔥 Amazon's Choice",
    image: null,
    href: "/products",
  },
  {
    id: 2,
    title: "Designer Anarkali Suit",
    subtitle: "Festive Collection 2025",
    originalPrice: 6499,
    dealPrice: 2799,
    discount: 57,
    rating: 4.5,
    reviews: 1892,
    stock: 8,
    totalStock: 40,
    badge: "TOP DEAL",
    badgeColor: "var(--myntra-pink)",
    tag: "❤️ Myntra Favourite",
    image: null,
    href: "/products",
  },
  {
    id: 3,
    title: "Embroidered Lehenga Choli",
    subtitle: "Bridal & Wedding Wear",
    originalPrice: 12999,
    dealPrice: 5499,
    discount: 58,
    rating: 4.8,
    reviews: 987,
    stock: 5,
    totalStock: 30,
    badge: "BEST PRICE",
    badgeColor: "var(--flipkart-blue)",
    tag: "💙 Flipkart Assured",
    image: null,
    href: "/products",
  },
];

/* ── Countdown ── */
function useCountdown(endHour = 23, endMin = 59) {
  const getRemaining = () => {
    const now = new Date();
    const end = new Date();
    end.setHours(endHour, endMin, 59, 0);
    if (end <= now) end.setDate(end.getDate() + 1);
    const diff = Math.max(0, Math.floor((end - now) / 1000));
    return { h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 };
  };
  const [time, setTime] = useState(getRemaining);
  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const pad = (n) => String(n).padStart(2, "0");

/* ── Star Rating ── */
const Stars = ({ rating }) => (
  <span className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar
        key={s}
        className="text-[10px]"
        style={{ color: s <= Math.round(rating) ? "#FF9900" : "#e0e0e0" }}
      />
    ))}
    <span className="text-[10px] text-gray-500 ml-1">{rating}</span>
  </span>
);

export default function DealOfDay() {
  const time = useCountdown();
  const [active, setActive] = useState(0);
  const deal = deals[active];
  const stockPct = Math.round((deal.stock / deal.totalStock) * 100);

  return (
    <section className="py-10 px-4 md:px-9 bg-white border-y border-gray-100">
      {/* Section Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
            style={{ background: "var(--amazon-orange)" }}
          >
            <FaFire className="text-lg" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Deal of the Day
            </h2>
            <p className="text-xs text-gray-400">Handpicked deals — refreshed daily!</p>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2">
          <MdTimer className="text-xl" style={{ color: "var(--deal-red)" }} />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider mr-1">
            Ends in:
          </span>
          {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
            <React.Fragment key={i}>
              <span
                className="text-white text-sm font-black px-2.5 py-1.5 rounded-lg tabular-nums min-w-[36px] text-center"
                style={{ background: "var(--deal-red)" }}
              >
                {val}
              </span>
              {i < 2 && (
                <span className="font-black text-sm" style={{ color: "var(--deal-red)" }}>
                  :
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Deal Tabs + Content */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Tab Selector */}
        <div className="md:col-span-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {deals.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setActive(i)}
              className={`shrink-0 text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                active === i
                  ? "border-transparent text-white shadow-md"
                  : "border-gray-100 bg-white text-gray-600 hover:border-gray-300"
              }`}
              style={
                active === i
                  ? { background: d.badgeColor }
                  : {}
              }
            >
              <p className={`text-[10px] font-black uppercase tracking-widest ${active === i ? "text-white/80" : "text-gray-400"}`}>
                {d.badge}
              </p>
              <p className={`text-xs font-bold truncate mt-0.5 ${active === i ? "text-white" : "text-gray-700"}`}>
                {d.title}
              </p>
            </button>
          ))}
        </div>

        {/* Main Deal Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={deal.id}
            className="md:col-span-4 bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
          >
            {/* Image Placeholder */}
            <div
              className="w-full sm:w-48 md:w-56 h-56 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${deal.badgeColor}18, ${deal.badgeColor}08)`,
                border: `1.5px dashed ${deal.badgeColor}40`,
              }}
            >
              <div className="text-center">
                <p className="text-5xl mb-2">🛍️</p>
                <p className="text-xs text-gray-400 font-medium">Product Image</p>
              </div>
              {/* Badge */}
              <span
                className="absolute top-3 left-3 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider"
                style={{ background: deal.badgeColor }}
              >
                {deal.discount}% OFF
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-3">
              {/* Tag */}
              <span
                className="text-[11px] font-bold w-fit px-2.5 py-1 rounded-full"
                style={{
                  background: `${deal.badgeColor}15`,
                  color: deal.badgeColor,
                }}
              >
                {deal.tag}
              </span>

              <div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                  {deal.title}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">{deal.subtitle}</p>
              </div>

              {/* Rating */}
              <Stars rating={deal.rating} />
              <p className="text-[11px] text-gray-400 -mt-2">
                {deal.reviews.toLocaleString("en-IN")} verified reviews
              </p>

              {/* Pricing */}
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-gray-900">
                  ₹{deal.dealPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-base text-gray-400 line-through pb-0.5">
                  ₹{deal.originalPrice.toLocaleString("en-IN")}
                </span>
                <span
                  className="text-sm font-black pb-0.5"
                  style={{ color: deal.badgeColor }}
                >
                  {deal.discount}% OFF
                </span>
              </div>

              <p className="text-xs font-semibold" style={{ color: "var(--deal-green)" }}>
                You save ₹{(deal.originalPrice - deal.dealPrice).toLocaleString("en-IN")} on this deal!
              </p>

              {/* Stock Progress */}
              <div>
                <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                  <span className="font-bold" style={{ color: "var(--deal-red)" }}>
                    🔥 Only {deal.stock} left in stock!
                  </span>
                  <span>{stockPct}% sold</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${100 - stockPct}%`, background: deal.badgeColor }}
                  />
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mt-1 flex-wrap">
                <Link
                  href={deal.href}
                  className="flex-1 min-w-[120px] text-center py-3 rounded-xl text-white text-sm font-black transition-opacity hover:opacity-85 flex items-center justify-center gap-2"
                  style={{ background: deal.badgeColor }}
                >
                  <BsLightningFill />
                  Buy Now
                </Link>
                <Link
                  href="/cart"
                  className="flex-1 min-w-[120px] text-center py-3 rounded-xl text-sm font-black border-2 transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
                  style={{ borderColor: deal.badgeColor, color: deal.badgeColor }}
                >
                  Add to Cart
                </Link>
              </div>

              {/* Offers */}
              <div className="flex flex-wrap gap-2 mt-1">
                {[
                  { icon: "🏦", text: "Bank offer: Extra 10% off with HDFC" },
                  { icon: "🚀", text: "Free Express Delivery" },
                  { icon: "🔄", text: "30-Day Easy Returns" },
                ].map((o, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2.5 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600"
                  >
                    {o.icon} {o.text}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
