"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Partnership } from "@/Data/Partnership";
import { summerimg } from "@/Data/summerimg";
import { addToCart } from "@/redux/cartSlice";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import SkeletonCard from "@/components/SkeletonCard"; // 👈
import Slider1 from "./Slider1";
import Slider2 from "./Slider2";

export default function MostTrending() {
  const [product, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // 👈
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    fetch("api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false); // 👈
      });
  }, []);

  const handleAddToCart = (item) => {
    try {
      const user = true;

      if (!user) {
        toast.error("Please login first to add to cart");
        setTimeout(() => {
          router.push("/Signin");
        }, 1000);
        return;
      }
      dispatch(addToCart(item));
      toast.success("Product added to cart successfully");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Heading */}
      <motion.h1
        className="text-2xl font-medium mt-8 px-9 overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Most Trending
      </motion.h1>

      {/* Products or Skeletons */}
      <div className="py-8 grid grid-cols-2 md:grid-cols-4 gap-3 px-8 md:gap-0">
        {loading
          ? [...Array(8)].map((_, index) => <SkeletonCard key={index} />)
          : product.map((item, index) => (
              <motion.div
                key={item._id || index}
                className="md:px-4 md:py-4 cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/product/${item._id}`}>
                  <Image
                    src={item.image}
                    width={800}
                    height={0}
                    loading="lazy" // 👈 lazy loading
                    alt="trendingimgs"
                    className="aspect-[253/337] object-cover object-top shadow-md hover:scale-[1.05] transition-all duration-300"
                  />
                </Link>
                <p className="font-medium text-[12px] py-2">{item.name}</p>
                <p className="text-[12px] font-medium py-2">Rs.{item.price}</p>
                <button
                  className="text-[12px] w-full px-2 py-2 md:py-4 md:px-4 font-medium bg-black text-white cursor-pointer"
                  onClick={() => handleAddToCart(item)}
                >
                  ADD TO CART
                </button>
              </motion.div>
            ))}
      </div>

      {/* Partnership Section */}
      <motion.div
        className="py-4 justify-center md:gap-24 gap-2 flex px-5 flex-wrap"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {Partnership.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              className="flex flex-col items-center hover:shadow-md transition text-center p-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Icon className="md:text-5xl text-3xl text-black mb-2" />
              <p className="font-medium md:text-sm text-[10px]">{item.text}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Summer Essentials */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-1xl md:text-2xl font-medium text-center">
          SUMMER ESSENTIALS 🎇
          <p className="text-[12px] text-gray-500">Hot Picks For The Season</p>
        </h1>
        <div className="px-3 md:px-10 md:gap-6 grid grid-cols-3 gap-2 mt-6">
          {summerimg.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Image
                src={item.image}
                width={400}
                height={400}
                alt={`summer-img-${index}`}
                loading="lazy" // 👈 lazy loading
                className="rounded-lg w-full aspect-[253/337] object-cover object-top shadow-md hover:scale-[1.05] transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-1xl md:text-2xl font-medium text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          NEW TRENDS TO TRY 👓
          <p className="text-[12px] text-gray-500">Hot Picks For The Season</p>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Slider1 />
          <Slider2 />
        </motion.div>
      </motion.div>
    </>
  );
}
