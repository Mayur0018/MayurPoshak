"use client";
import React from "react";
import Marquee from "react-fast-marquee";

const announcements = [
  "🚚 Free Express Delivery on All Orders",
  "🔒 100% Secure Payments",
  "🔄 Easy Exchange & Returns",
  "💳 COD Available",
  "✨ New Collections Every Week",
  "⭐ Trusted by 10,000+ Happy Customers",
];

const AnnouncementBar = () => {
  return (
    <div className="bg-black text-white text-xs font-medium py-2 overflow-hidden z-50">
      <Marquee pauseOnHover gradient={false} speed={55}>
        {announcements.map((text, i) => (
          <span key={i} className="mx-8 tracking-wider uppercase">
            {text}
            <span className="mx-8 text-gray-40">|</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
};

export default AnnouncementBar;
