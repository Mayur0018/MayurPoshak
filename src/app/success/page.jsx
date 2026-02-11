"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BsFillCheckCircleFill } from "react-icons/bs";

const SuccessPage = ({children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-green-50"
    >
      <BsFillCheckCircleFill className="text-green-600 text-6xl mb-4 animate-pulse" />

      <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
        Payment Successful 🎉
      </h1>

      <p className="text-lg text-slate-700 mb-6 max-w-md">
        Thank you for your purchase! Your payment has been processed successfully.
      </p>

      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
      >
        Back to Home
      </Link>
    </motion.div>
  );
};

export default SuccessPage;
