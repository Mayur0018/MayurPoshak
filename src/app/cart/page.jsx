"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { decrementQty, incrementQty, removeFromCart } from "@/redux/slices/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import { RxCross1 } from "react-icons/rx";
import { FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { MdLock } from "react-icons/md";
import { useRouter } from "next/navigation";

const FREE_SHIPPING_THRESHOLD = 999;

export default function CartPage() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    router.push("/checkout");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <FiShoppingCart className="text-8xl text-gray-200" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-400 mt-2">Looks like you haven't added anything yet.</p>
        </div>
        <Link
          href="/"
          className="mt-2 px-10 py-3.5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition text-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-medium">Review your items</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">Shopping Cart</h1>
          <p className="text-sm text-gray-400 mt-1">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Free Shipping bar */}
        <div className="mb-6 bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
          {remaining > 0 ? (
            <>
              <p className="text-sm text-gray-600">
                Add <span className="font-bold text-gray-900">₹{remaining.toLocaleString("en-IN")}</span> more to get{" "}
                <span className="font-bold text-green-600">FREE shipping!</span>
              </p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm font-semibold text-green-600">🎉 You're eligible for free shipping!</p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT — Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <AnimatePresence>
              {cartItems.map((item, idx) => {
                const displaySize = item.selectedSize || (Array.isArray(item.size) ? null : item.size);
                return (
                <motion.div
                  key={`${item._id || item.product}-${displaySize || idx}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-5 flex gap-5 shadow-sm border border-gray-100"
                >
                  {/* Image */}
                  <Link href={`/product/${item._id}`} className="shrink-0">
                    <div className="w-24 h-28 rounded-xl overflow-hidden bg-gray-100 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/product/${item._id}`}>
                          <h3 className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        {displaySize && (
                          <p className="text-xs text-gray-400 mt-0.5">Size: {displaySize}</p>
                        )}
                        {item.color && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs text-gray-400">Color:</span>
                            <span
                              className="w-4 h-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart({ id: item._id || item.product, sku: item.variant?.sku, size: item.selectedSize || (Array.isArray(item.size) ? null : item.size) }))}
                        className="text-gray-300 hover:text-red-500 transition shrink-0"
                      >
                        <RxCross1 />
                      </button>
                    </div>

                    {/* Price + Qty */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5">
                        <button
                          onClick={() => dispatch(decrementQty({ id: item._id || item.product, sku: item.variant?.sku, size: item.selectedSize || (Array.isArray(item.size) ? null : item.size) }))}
                          className="text-gray-600 hover:text-black font-bold transition w-4 text-center"
                        >
                          −
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(incrementQty({ id: item._id || item.product, sku: item.variant?.sku, size: item.selectedSize || (Array.isArray(item.size) ? null : item.size) }))}
                          className="text-gray-600 hover:text-black font-bold transition w-4 text-center"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-base font-bold text-gray-900">
                        ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="h-max sticky top-24">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900 text-base">Total</span>
                  <span className="font-bold text-gray-900 text-base">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-gray-400">Taxes calculated at checkout</p>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="mt-6 w-full py-4 bg-black text-white font-bold rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              >
                {checkoutLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <MdLock className="text-lg" />
                    Checkout Securely
                    <FiArrowRight />
                  </>
                )}
              </button>

              <Link
                href="/"
                className="mt-3 w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-full flex items-center justify-center text-sm hover:bg-gray-50 transition"
              >
                Continue Shopping
              </Link>

              {/* Payment Icons */}
              <div className="mt-5 flex justify-center gap-3 items-center opacity-60">
                <Image src="/Cardsimg/gpay.jpg" alt="gpay" width={36} height={22} className="rounded" />
                <Image src="/Cardsimg/mastercard.png" alt="mastercard" width={36} height={22} className="rounded" />
                <Image src="/Cardsimg/paypa.png" alt="paypal" width={36} height={22} className="rounded" />
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">🔒 Your payment is secure & encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
