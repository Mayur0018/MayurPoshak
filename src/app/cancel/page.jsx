"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiXCircle, FiArrowLeft, FiShoppingCart } from "react-icons/fi";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8"
      >
        <FiXCircle size={48} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
      >
        Payment Cancelled
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 max-w-md text-lg mb-12"
      >
        Your payment was not completed. No charges were made to your account. You can return to your cart and try again.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row gap-4 w-full max-w-md"
      >
        <Link
          href="/cart"
          className="flex-1 bg-black text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg"
        >
          <FiShoppingCart /> Return to Cart
        </Link>
        <Link
          href="/"
          className="flex-1 border border-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <FiArrowLeft /> Back to Shop
        </Link>
      </motion.div>

      <div className="mt-16 text-gray-400 text-sm">
        <p>Having trouble? <Link href="/Contact" className="text-black font-bold underline">Contact our support</Link></p>
      </div>
    </div>
  );
}
