"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdOutlineCancel } from "react-icons/md";

const CancelPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-red-50"
    >
      <MdOutlineCancel className="text-red-600 text-6xl mb-4 animate-pulse" />

      <h1 className="text-3xl md:text-4xl font-bold text-red-700 mb-4">
        Payment Cancelled ❌
      </h1>

      <p className="text-lg text-slate-700 mb-6 max-w-md">
        Your payment was cancelled. You can retry the payment anytime.
      </p>

      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
      >
        Back to Home
      </Link>
    </motion.div>
  );
};

export default CancelPage;
