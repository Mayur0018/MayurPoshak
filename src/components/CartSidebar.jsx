"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  closeCartSidebar,
  incrementQty,
  decrementQty,
  removeFromCart,
} from "@/redux/cartSlice";
import Link from "next/link";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { MdLock } from "react-icons/md";

const FREE_SHIPPING_THRESHOLD = 999;

const CartSidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cartItems, sidebarOpen } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price ?? 0) * item.quantity,
    0
  );
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) return;
    dispatch(closeCartSidebar());
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[110] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCartSidebar())}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-[120] flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-medium">
                  Your
                </p>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  Cart
                </h2>
              </div>
              <button
                onClick={() => dispatch(closeCartSidebar())}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <RxCross1 className="text-sm text-gray-700" />
              </button>
            </div>

            {/* Free Shipping Banner */}
            {cartItems.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                {remaining > 0 ? (
                  <>
                    <p className="text-xs text-gray-600">
                      Add{" "}
                      <span className="font-bold text-gray-900">
                        ₹{remaining.toLocaleString("en-IN")}
                      </span>{" "}
                      more for{" "}
                      <span className="font-bold text-green-600">
                        FREE shipping
                      </span>
                    </p>
                    <div className="w-full bg-gray-200 h-1 rounded-full mt-2">
                      <div
                        className="bg-green-500 h-1 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-xs font-semibold text-green-600">
                    🎉 You are eligible for{" "}
                    <span className="underline">free shipping!</span>
                  </p>
                )}
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                  <FiShoppingCart className="text-6xl text-gray-200" />
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add items to get started
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch(closeCartSidebar())}
                    className="mt-2 px-8 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    {/* Image */}
                    <Link
                      href={`/product/${item._id}`}
                      onClick={() => dispatch(closeCartSidebar())}
                      className="shrink-0"
                    >
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-gray-100 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item._id}`}
                          onClick={() => dispatch(closeCartSidebar())}
                          className="text-sm font-semibold text-gray-900 leading-tight hover:text-gray-600 transition line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => dispatch(removeFromCart(item._id))}
                          className="shrink-0 text-gray-300 hover:text-red-500 transition"
                        >
                          <RxCross1 className="text-xs" />
                        </button>
                      </div>

                      {item.size && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Size: {item.size}
                        </p>
                      )}

                      {/* Qty + Price */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Qty controls */}
                        <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1">
                          <button
                            onClick={() => dispatch(decrementQty(item._id))}
                            className="text-gray-600 hover:text-black transition w-5 text-center font-medium"
                          >
                            −
                          </button>
                          <span className="text-sm font-semibold w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(incrementQty(item._id))}
                            className="text-gray-600 hover:text-black transition w-5 text-center font-medium"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-bold text-gray-900">
                          ₹
                          {(
                            Number(item.price) * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 flex flex-col gap-4 bg-white">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </p>
                </div>
                <p className="text-xs text-gray-400 -mt-3">
                  Taxes and shipping calculated at checkout
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Link
                    href="/cart"
                    onClick={() => dispatch(closeCartSidebar())}
                    className="flex-1 py-3 border-2 border-black text-black text-sm font-bold rounded-full text-center hover:bg-gray-50 transition"
                  >
                    View Cart
                  </Link>
                  <button
                    disabled={loading}
                    onClick={handleCheckout}
                    className="flex-1 py-3 bg-black text-white text-sm font-bold rounded-full text-center hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <MdLock />
                        Checkout
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
