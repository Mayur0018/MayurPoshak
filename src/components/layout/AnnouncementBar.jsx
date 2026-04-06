"use client";
import React, { useState } from "react";
import Marquee from "react-fast-marquee";
import toast from "react-hot-toast";

const announcements = [
  { text: "🚚 Free Express Delivery on orders above ₹999", color: "var(--flipkart-blue)" },
  { text: "🔥 USE CODE: MAYUR10 — Get 10% OFF your first order!", color: "var(--myntra-pink)" },
  { text: "⚡ Flash Sale Live Now — Up to 60% OFF on selected styles!", color: "var(--amazon-orange)" },
  { text: "🔒 100% Secure Payments — UPI, Cards, COD Available", color: "#fff" },
  { text: "🔄 Easy 7-Day Exchange & Returns — No Questions Asked", color: "#fff" },
  { text: "🎁 USE CODE: GIFT50 — ₹50 OFF on orders above ₹1499", color: "var(--myntra-pink)" },
  { text: "✨ New Collections Every Week — Follow us on Instagram!", color: "var(--amazon-orange)" },
  { text: "⭐ Trusted by 10,000+ Happy Customers Across India", color: "#fff" },
];

const AnnouncementBar = () => {
  const [copied, setCopied] = useState(null);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    toast.success(`Code "${code}" copied! Apply at checkout.`, {
      style: { background: "#111", color: "#fff", fontSize: "12px" },
    });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div
      className="text-white text-[11px] font-semibold py-2 overflow-hidden z-50 relative"
      style={{
        background: "linear-gradient(90deg, #0a0a0a 0%, #172337 40%, #0a0a0a 100%)",
        borderBottom: "1px solid rgba(255,153,0,0.18)",
      }}
    >
      <Marquee pauseOnHover gradient={false} speed={50}>
        {announcements.map((item, i) => {
          // Extract coupon code if present
          const codeMatch = item.text.match(/CODE:\s*([A-Z0-9]+)/);
          const code = codeMatch ? codeMatch[1] : null;

          return (
            <span
              key={i}
              className="mx-8 tracking-wider uppercase flex items-center gap-2 cursor-default"
              style={{ color: item.color }}
            >
              {code ? (
                <>
                  {item.text.split(new RegExp(`(${code})`)).map((part, pi) =>
                    part === code ? (
                      <button
                        key={pi}
                        onClick={() => copyCode(code)}
                        className="font-black px-2 py-0.5 rounded text-[10px] border transition-all hover:scale-105 active:scale-95"
                        style={{
                          background: "rgba(255,255,255,0.12)",
                          borderColor: item.color,
                          color: item.color,
                        }}
                        title="Click to copy code"
                      >
                        {code} 📋
                      </button>
                    ) : (
                      <span key={pi}>{part}</span>
                    )
                  )}
                </>
              ) : (
                item.text
              )}
              <span className="mx-4 opacity-30">•</span>
            </span>
          );
        })}
      </Marquee>
    </div>
  );
};

export default AnnouncementBar;
