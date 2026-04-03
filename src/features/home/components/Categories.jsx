"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { category } from "@/data/Category";
import Slider3 from "@/components/ui/Slider3";
import Link from "next/link";

const Categories = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.h1
        className="flex justify-center items-center py-5 md:py-8 text-2xl md:text-5xl"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        SHOP BY CATEGORIES
      </motion.h1>

      <div className="grid grid-cols-3 px-4 md:px-20 gap-4 md:grid-cols-5 py-10 md:py-16 justify-items-center">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center animate-pulse">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-300" />
                <div className="h-3 w-12 bg-gray-300 mt-3 rounded" />
              </div>
            ))
          : category.map((items, index) => (
              <Link
                key={items.id}
                href={`/${items.slug}`}
                className="block group"
              >
                <motion.div
                  className="flex flex-col items-center cursor-pointer"
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <div className="relative w-20 h-20 md:w-28 md:h-28 overflow-hidden rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={items.Image}
                      fill
                      alt={items.text}
                      className="object-cover object-top"
                    />
                  </div>
                  <p className="text-[10px] md:text-xs mt-3 font-semibold tracking-wider text-gray-800 uppercase">
                    {items.text}
                  </p>
                </motion.div>
              </Link>
            ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {loading ? (
          <div className="w-full h-60 md:h-80 bg-gray-300 animate-pulse rounded-md" />
        ) : (
          <Image
            src="/Category/Grey Photo India Shopping Guide YouTube Thumbnail.png"
            width={2000}
            height={600}
            alt="Banner"
            className="md:w-full rounded-md"
          />
        )}
      </motion.div>

      <Slider3 />
    </>
  );
};

export default Categories;
