"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { category } from "@/Data/Category";
import Slider3 from "../ui/Slider3";
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

      <div className="grid grid-cols-3 px-8 md:px-30 gap-2 md:grid-cols-6 py-10 md:py-16">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center animate-pulse">
                <div className="w-24 h-24 rounded-full bg-gray-300" />
                <div className="h-3 w-12 bg-gray-300 mt-4 rounded" />
              </div>
            ))
          : category.map((items, index) => (
              <Link
                key={items.id}
                href={`/categories/${items.slug}`}
                className="block"
              >
                <motion.div
                  className="px-1 py-1 flex flex-col items-center cursor-pointer"
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
                  <Image
                    src={items.Image}
                    width={80}
                    height={80}
                    alt={items.text}
                    className="object-cover rounded-full md:w-24 md:h-24 h-24 w-24 aspect-[253/337] object-top shadow-md hover:scale-[1.05] transition-all duration-300"
                  />
                  <p className="text-[10px] mt-4 font-medium">
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
