"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Partnership } from "@/Data/Partnership";
import { summerimg } from "@/Data/summerimg";
import { addToCart } from "@/features/cart/cartSlice";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import supabase from "@/lib/supabaseClient";
import { useWishlist } from "@/hooks/useWishlist";
import SkeletonCard from "@/components/ui/SkeletonCard";
import Slider1 from "@/components/ui/Slider1";
import Slider2 from "@/components/ui/Slider2";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

/* ========================
   SIZE PICKER PRODUCT CARD
========================= */
const SIZES = ["XS", "S", "M", "L", "XL"];

const ProductCard = ({ item, index, isWishlisted, toggleWishlist }) => {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    dispatch(addToCart({ ...item, size: selectedSize }));
    toast.success(`Added to cart — Size ${selectedSize}`);
  };

  return (
    <motion.div
      key={item._id || index}
      className="relative cursor-pointer group"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSelectedSize(null);
      }}
    >
      <Link href={`/product/${item._id}`}>
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <Image
            src={item.image}
            width={800}
            height={0}
            loading="lazy"
            alt={item.name}
            className="aspect-[253/337] object-cover object-top shadow-md group-hover:scale-[1.04] transition-transform duration-500"
          />

          {/* Wishlist Heart */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(item);
            }}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md text-slate-900 shadow hover:bg-white transition-all transform hover:scale-110 active:scale-90"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500 text-sm" />
            ) : (
              <FiHeart className="text-sm" />
            )}
          </button>

          {/* Hover Overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm px-3 py-3"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Size picker */}
                <div className="flex gap-1.5 justify-center mb-2 flex-wrap">
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedSize(sz);
                      }}
                      className={`text-[10px] font-semibold px-2 py-1 border rounded transition-all duration-200 ${
                        selectedSize === sz
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:border-black"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white text-[11px] font-bold py-2 rounded hover:bg-gray-800 transition"
                >
                  ADD TO CART
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>

      <p className="font-medium text-[12px] py-1.5 truncate">{item.name}</p>
      <p className="text-[12px] font-semibold text-gray-800">₹{item.price}</p>
    </motion.div>
  );
};

/* ========================
   MOST TRENDING
========================= */
export default function MostTrending() {
  const [product, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetch("api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Heading */}
      <motion.div
        className="px-9 mt-10 flex items-center justify-between"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-3xl font-bold tracking-tight luxury-serif">
          Most Trending
        </h1>
        <Link
          href="/products"
          className="text-xs font-semibold uppercase tracking-widest border-b border-black hover:text-gray-500 hover:border-gray-500 transition"
        >
          View All →
        </Link>
      </motion.div>

      {/* Products or Skeletons */}
      <div className="py-8 flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:gap-6 px-5 md:px-9 pb-12">
        {loading
          ? [...Array(8)].map((_, index) => (
              <div
                key={index}
                className="w-[160px] md:w-[280px] shrink-0 snap-center"
              >
                <SkeletonCard />
              </div>
            ))
          : product.slice(0, 8).map((item, index) => (
              <div
                key={item._id || index}
                className="w-[160px] md:w-[280px] shrink-0 snap-center"
              >
                <ProductCard
                  item={item}
                  index={index}
                  isWishlisted={isInWishlist(item._id)}
                  toggleWishlist={toggleWishlist}
                />
              </div>
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
        <h1 className="text-2xl md:text-3xl font-bold text-center luxury-serif">
          SUMMER ESSENTIALS 🎇
          <p className="text-[12px] text-gray-500 font-normal mt-1 font-sans">
            Hot Picks For The Season
          </p>
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
                loading="lazy"
                className="rounded-lg w-full aspect-[253/337] object-cover object-top shadow-md hover:scale-[1.05] transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* New Trends */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-center luxury-serif">
          NEW TRENDS TO TRY 👓
          <p className="text-[12px] text-gray-500 font-normal mt-1 font-sans">
            Hot Picks For The Season
          </p>
        </h1>

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
