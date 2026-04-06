"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaBoltLightning } from "react-icons/fa6";
import { MdLocalOffer } from "react-icons/md";

/* ─── Deals Data ─── */
const flashDeals = [
  {
    id: 1,
    title: "Banarasi Silk Saree",
    originalPrice: 4999,
    salePrice: 2499,
    discount: 50,
    sold: 72,
    total: 100,
    badge: "HOT",
    color: "var(--myntra-pink)",
    href: "/products",
  },
  {
    id: 2,
    title: "Designer Lehenga",
    originalPrice: 8999,
    salePrice: 4499,
    discount: 50,
    sold: 45,
    total: 80,
    badge: "TRENDING",
    color: "var(--flipkart-blue)",
    href: "/products",
  },
  {
    id: 3,
    title: "Cotton Kurti Set",
    originalPrice: 1999,
    salePrice: 899,
    discount: 55,
    sold: 90,
    total: 120,
    badge: "LAST FEW",
    color: "var(--amazon-orange)",
    href: "/products",
  },
  {
    id: 4,
    title: "Party Wear Gown",
    originalPrice: 6499,
    salePrice: 2999,
    discount: 54,
    sold: 30,
    total: 60,
    badge: "NEW",
    color: "var(--myntra-pink)",
    href: "/products",
  },
  {
    id: 5,
    title: "Men's Sherwani",
    originalPrice: 7999,
    salePrice: 3799,
    discount: 52,
    sold: 18,
    total: 50,
    badge: "DEAL",
    color: "var(--flipkart-blue)",
    href: "/products",
  },
];

/* ─── Countdown Timer ─── */
function useCountdown(hours = 8) {
  const [time, setTime] = useState({ h: hours, m: 59, s: 59 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const pad = (n) => String(n).padStart(2, "0");

/* ─── Deal Card ─── */
const DealCard = ({ deal, index }) => {
  const pct = Math.round((deal.sold / deal.total) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="min-w-[200px] md:min-w-[220px] bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      {/* Badge */}
      <span
        className="absolute top-3 left-3 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
        style={{ background: deal.color }}
      >
        {deal.badge}
      </span>

      {/* Discount bubble */}
      <div
        className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-[11px] font-black"
        style={{ background: deal.color }}
      >
        {deal.discount}%<br />
        <span className="text-[8px] font-medium -mt-1">OFF</span>
      </div>

      {/* Price */}
      <div className="mt-6">
        <p className="text-lg font-black text-gray-900">
          ₹{deal.salePrice.toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-gray-400 line-through">
          ₹{deal.originalPrice.toLocaleString("en-IN")}
        </p>
        <p className="text-[11px] font-semibold mt-0.5" style={{ color: deal.color }}>
          You save ₹{(deal.originalPrice - deal.salePrice).toLocaleString("en-IN")}
        </p>
      </div>

      <p className="text-xs font-semibold text-gray-700 truncate">{deal.title}</p>

      {/* Progress bar */}
      <div>
        <p className="text-[10px] text-gray-400 mb-1">{deal.sold} sold out of {deal.total}</p>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: deal.color }}
          />
        </div>
      </div>

      <Link
        href={deal.href}
        className="mt-1 text-center text-[11px] font-black py-2 rounded-lg text-white transition-opacity hover:opacity-80"
        style={{ background: deal.color }}
      >
        GRAB DEAL
      </Link>
    </motion.div>
  );
};

/* ─── Main Component ─── */
export default function FlashSale() {
  const time = useCountdown(8);

  return (
    <section className="py-8 px-4 md:px-9 bg-white">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <FaBoltLightning className="text-2xl text-[var(--amazon-orange)]" />
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Flash Sale
            </h2>
            <p className="text-xs text-gray-500">Limited time — grab before it's gone!</p>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-1 ml-4">
            {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
              <React.Fragment key={i}>
                <span className="bg-gray-900 text-white text-sm font-black px-2.5 py-1.5 rounded-md tabular-nums min-w-[36px] text-center">
                  {val}
                </span>
                {i < 2 && <span className="text-gray-900 font-black text-sm">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Link
          href="/products"
          className="text-xs font-black uppercase tracking-widest border-b-2 self-start sm:self-auto transition"
          style={{ borderColor: "var(--myntra-pink)", color: "var(--myntra-pink)" }}
        >
          View All Deals →
        </Link>
      </motion.div>

      {/* Deal Cards horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar snap-x snap-mandatory">
        {flashDeals.map((deal, i) => (
          <div key={deal.id} className="snap-start shrink-0">
            <DealCard deal={deal} index={i} />
          </div>
        ))}
      </div>

      {/* Bottom offers bar */}
      <motion.div
        className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        {[
          { icon: "🚀", label: "Free Express Delivery", sub: "On orders above ₹999", color: "var(--flipkart-blue)" },
          { icon: "🔄", label: "Easy 30-Day Returns", sub: "No questions asked", color: "var(--myntra-pink)" },
          { icon: "🔒", label: "Secure Payments", sub: "UPI, Cards, Wallets & COD", color: "var(--deal-green)" },
          { icon: "🎁", label: "Gift Wrapping", sub: "Available on all orders", color: "var(--amazon-orange)" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 hover:shadow-sm transition"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-xs font-bold text-gray-800">{item.label}</p>
              <p className="text-[10px] text-gray-400">{item.sub}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
