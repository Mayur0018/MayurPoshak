"use client";
import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiCheckCircle, FiArrowRight, FiPackage, FiLoader } from "react-icons/fi";
import confetti from "canvas-confetti";
import { useDispatch } from "react-redux";
import { clearCart } from "@/features/cart/cartSlice";

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
        Payment Successful
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 max-w-md text-lg mb-12"
      >
        Thank you for your purchase. Your order has been received and is being processed by our artisans.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row gap-4 w-full max-w-md"
      >
        <Link
          href="/orders"
          className="flex-1 bg-black text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg"
        >
          <FiPackage /> View Orders
        </Link>
        <Link
          href="/"
          className="flex-1 border border-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          Back to Home <FiArrowRight />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16 p-6 bg-gray-50 rounded-3xl border border-gray-100 max-w-sm"
      >
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Confirmation</p>
        <p className="text-sm text-gray-600">A confirmation email has been sent to your registered address with all order details.</p>
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
