"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MdVerified, MdLocalShipping, MdSupportAgent, MdLoop } from "react-icons/md";
import { FaStar, FaShieldAlt } from "react-icons/fa";

function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return [count, ref];
}

const stats = [
  { target: 10000, suffix: "+", label: "Happy Customers", color: "var(--amazon-orange)" },
  { target: 5000, suffix: "+", label: "Products Listed", color: "var(--myntra-pink)" },
  { target: 99, suffix: "%", label: "Satisfaction Rate", color: "var(--flipkart-blue)" },
  { target: 48, suffix: "hr", label: "Fast Delivery", color: "var(--deal-green)" },
];

const trustPoints = [
  {
    icon: MdVerified,
    title: "100% Authentic",
    desc: "Every product verified — Amazon Assured quality standards",
    color: "var(--amazon-orange)",
  },
  {
    icon: MdLocalShipping,
    title: "Express Delivery",
    desc: "Free shipping on orders ₹499+ — Flipkart-fast logistics",
    color: "var(--flipkart-blue)",
  },
  {
    icon: MdLoop,
    title: "Easy Returns",
    desc: "30-day hassle-free returns — just like Myntra's promise",
    color: "var(--myntra-pink)",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Payments",
    desc: "UPI, Cards, Wallets, NetBanking & COD all accepted",
    color: "var(--deal-green)",
  },
  {
    icon: MdSupportAgent,
    title: "24/7 Support",
    desc: "Real humans, not bots — always here to help you",
    color: "#9C27B0",
  },
  {
    icon: FaStar,
    title: "Top Rated",
    desc: "4.8★ rated by 10,000+ customers across India",
    color: "#FF5722",
  },
];

function StatCounter({ stat }) {
  const [count, ref] = useCounter(stat.target);
  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl md:text-4xl font-black" style={{ color: stat.color }}>
        {count.toLocaleString("en-IN")}{stat.suffix}
      </p>
      <p className="text-xs text-gray-500 font-medium mt-1">{stat.label}</p>
    </div>
  );
}

export default function TrustBar() {
  return (
    <section className="py-10 px-4 md:px-9 bg-white">
      {/* Stats Row */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 p-5 md:p-6 rounded-2xl border border-gray-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,153,0,0.04) 0%, rgba(40,116,240,0.04) 50%, rgba(255,63,108,0.04) 100%)",
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {stats.map((s) => (
          <StatCounter key={s.label} stat={s} />
        ))}
      </motion.div>

      {/* Trust Points Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {trustPoints.map((tp, i) => {
          const Icon = tp.icon;
          return (
            <motion.div
              key={tp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center text-center gap-2 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all duration-200"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: `${tp.color}12` }}
              >
                <Icon className="text-xl" style={{ color: tp.color }} />
              </div>
              <p className="text-xs font-black text-gray-800 leading-tight">{tp.title}</p>
              <p className="text-[10px] text-gray-400 leading-snug">{tp.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Platform trust strip */}
      <motion.div
        className="mt-6 flex flex-wrap items-center justify-center gap-4 py-4 border-t border-gray-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-gray-400 font-medium">As trusted and featured on:</p>
        {[
          { name: "Amazon.in", bg: "var(--amazon-orange)", text: "#fff" },
          { name: "Myntra", bg: "var(--myntra-pink)", text: "#fff" },
          { name: "Flipkart", bg: "var(--flipkart-blue)", text: "#fff" },
          { name: "AJIO", bg: "#222", text: "#fff" },
          { name: "Meesho", bg: "#9C27B0", text: "#fff" },
        ].map((p) => (
          <span
            key={p.name}
            className="text-[11px] font-black px-4 py-1.5 rounded-full"
            style={{ background: p.bg, color: p.text }}
          >
            {p.name}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
