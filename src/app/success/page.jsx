"use client";
import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiCheckCircle, FiPackage } from "react-icons/fi";
import confetti from "canvas-confetti";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/slices/cartSlice";

function SuccessContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#C5A021", "#000000", "#FFFFFF"],
    });

    const verifyOrder = async () => {
      if (sessionId) {
        try {
          // Verify Stripe session details securely from backend API route
          await fetch("/api/orders/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          dispatch(clearCart());
        } catch (error) {
          console.error("Order verification failed:", error);
        }
      }
    };

    verifyOrder();
  }, [dispatch, sessionId]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8"
      >
        <FiCheckCircle size={48} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
      >
        Payment Successful 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 max-w-md text-lg mb-12"
      >
        Thank you for your purchase! Your payment has been processed successfully.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <Link
          href="/"
          className="bg-[#00b050] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#009040] transition shadow-lg text-lg"
        >
          Back to Home
        </Link>
        <Link
          href="/orders"
          className="text-gray-500 font-bold flex items-center justify-center gap-2 hover:text-black transition text-sm"
        >
          <FiPackage /> View Order History
        </Link>
      </motion.div>

    </div>
  );
}

function SuccessLoading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium">Verifying your payment...</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessContent />
    </Suspense>
  );
}
