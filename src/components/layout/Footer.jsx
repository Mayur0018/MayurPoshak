"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { CiMenuFries } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { TbShoppingBag } from "react-icons/tb";
import { RiContactsLine } from "react-icons/ri";

const Footer = () => {
  const [showMobileBar, setShowMobileBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowMobileBar(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/About" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact", href: "/Contact" },
    { label: "Sign In", href: "/Signin" },
  ];

  const categories = [
    { label: "Men", href: "/men" },
    { label: "Ladies", href: "/ladies" },
    { label: "Kids", href: "/kids" },
    { label: "Gen Z", href: "/genz" },
  ];

  const policies = [
    { label: "Free Express Delivery", icon: "🚚" },
    { label: "Easy Returns & Exchange", icon: "🔄" },
    { label: "COD Available", icon: "💳" },
    { label: "Secure Payments", icon: "🔒" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gray-950 text-gray-300"
    >
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-5">
          <Link href="/">
            <Image
              src="/mayurposhak.png"
              width={140}
              height={40}
              alt="Mayur Poshak"
              className="brightness-0 invert"
            />
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            Step into the world of Mayur Poshak — where tradition meets style.
            Explore exquisite sarees and contemporary fashion, crafted for every
            occasion.
          </p>
          <div className="flex gap-4 mt-2">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            >
              <FaFacebookF className="text-sm" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            >
              <FaInstagram className="text-sm" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            >
              <FaYoutube className="text-sm" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-3">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-gray-400 text-sm hover:text-white transition hover:translate-x-1 inline-block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
            Shop By Category
          </h3>
          <ul className="flex flex-col gap-3">
            {categories.map((cat) => (
              <li key={cat.label}>
                <Link
                  href={cat.href}
                  className="text-gray-400 text-sm hover:text-white transition hover:translate-x-1 inline-block"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies & Info */}
        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
            Our Promise
          </h3>
          <ul className="flex flex-col gap-3">
            {policies.map((p) => (
              <li key={p.label} className="flex items-center gap-2">
                <span className="text-base">{p.icon}</span>
                <span className="text-gray-400 text-sm">{p.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="text-gray-500 text-xs">📧 contact@mayurposhak.com</p>
            <p className="text-gray-500 text-xs mt-1">📞 +91 98765 43210</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-5 px-6">
        <p className="text-center text-gray-600 text-xs">
          © 2025 Mayur Poshak. All rights reserved. Made with ❤️ in India.
        </p>
      </div>

      {/* Mobile bottom nav bar */}
      {showMobileBar && (
        <motion.div
          className="fixed bottom-0 w-full bg-white md:hidden flex justify-around items-center py-3 shadow-lg z-50"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.4 }}
        >
          {[
            {
              icon: <AiFillHome className="text-2xl" />,
              label: "Home",
              href: "/",
            },
            {
              icon: <CiMenuFries className="text-2xl" />,
              label: "Menu",
              href: "/",
            },
            {
              icon: <IoSearchOutline className="text-2xl" />,
              label: "Search",
              href: "/",
            },
            {
              icon: <TbShoppingBag className="text-2xl" />,
              label: "Cart",
              href: "/cart",
            },
            {
              icon: <RiContactsLine className="text-2xl" />,
              label: "Contact",
              href: "/Contact",
            },
          ].map((item, idx) => (
            <Link
              href={item.href}
              key={idx}
              className="flex flex-col items-center text-xs font-medium text-gray-700"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center"
              >
                {item.icon}
                <span className="text-[10px] text-gray-500">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </motion.footer>
  );
};

export default Footer;
