"use client";
import React, { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { CiMenuFries } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { TbShoppingBag } from "react-icons/tb";
import { RiContactsLine } from "react-icons/ri";
import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFooter(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <hr className="w-full border-t border-gray-300" />
      <p className="text-[10px] text-center md:text-xs text-gray-500 py-24 font-medium">
        © 2025 Mayur Poshak ALL rights reserved
      </p>

      {showFooter && (
        <motion.div
          className="fixed bottom-0 w-full bg-white md:hidden flex justify-around items-center py-3 shadow-md"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.5 }}
        >
          {[
            { icon: <AiFillHome className="text-2xl" />, label: "Home", href: "/" },
            { icon: <CiMenuFries className="text-2xl" />, label: "Menu", href: "" },
            { icon: <IoSearchOutline className="text-2xl" />, label: "Search", href: "" },
            { icon: <TbShoppingBag className="text-2xl" />, label: "Cart", href: "/cart" },
            { icon: <RiContactsLine className="text-2xl" />, label: "Contact", href: "" },
          ].map((item, idx) => (
            <Link href={item.href} key={idx} className="flex flex-col items-center text-xs font-medium text-gray-700">
              <motion.div whileHover={{ scale: 1.1 }}>
                {item.icon}
                <span className="text-[10px] text-gray-500">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Footer;
