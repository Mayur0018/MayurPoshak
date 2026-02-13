"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineHeart, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import {
  decrementQty,
  incrementQty,
  removeFromCart,
} from "@/redux/cartSlice";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleCheckout = async () => {
    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setCheckoutLoading(true);
      setError(null);

      const stripe = await stripePromise;

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems }),
      });

      const data = await response.json();

      if (!response.ok || !data.id) {
        throw new Error(data.error || "Checkout failed");
      }

      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      setError(err.message || "Checkout failed");
      setCheckoutLoading(false);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
  const shipping = 2.0;
  const tax = 4.0;
  const total = subtotal + shipping + tax;

  const renderShimmer = () => (
    <div className="max-w-5xl mx-auto p-4 animate-pulse">
      {[1, 2].map((_, i) => (
        <div
          key={i}
          className="flex gap-4 bg-gray-100 px-4 py-6 rounded-md shadow-sm border border-gray-200 mb-4"
        >
          <div className="w-24 h-24 bg-gray-300 rounded" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-2/3" />
            <div className="h-4 bg-gray-300 rounded w-1/3" />
            <div className="h-4 bg-gray-300 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) return renderShimmer();

  return (
    <div>
      {cartItems.length > 0 ? (
        <div className="max-w-5xl max-lg:max-w-2xl mx-auto p-4">
          <h1 className="text-xl font-semibold text-slate-900">
            Shopping Cart
          </h1>

          {/* 🔥 FIX: GRID OUTSIDE MAP */}
          <div className="grid lg:grid-cols-3 lg:gap-x-8 gap-x-6 gap-y-8 mt-6">

            {/* LEFT SIDE - CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex gap-4 bg-white px-4 py-6 rounded-md shadow-sm border border-gray-200"
                >
                  <div className="flex gap-6 sm:gap-4 max-sm:flex-col">
                    <div className="w-24 h-24 shrink-0">
                      <Image
                        src={item.image}
                        alt="product"
                        width={100}
                        height={100}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                          {item.name}
                        </h3>
                        <p className="text-[13px] font-medium text-slate-500 mt-2 flex items-center gap-2">
                          Color:
                          <span className="inline-block w-4 h-4 rounded-sm bg-[#ac7f48]"></span>
                        </p>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 mt-auto">
                        {item.price}
                      </h3>
                    </div>
                  </div>

                  <div className="ml-auto flex flex-col justify-between">
                    <div className="flex items-start gap-4 justify-end">
                      <button>
                        <AiOutlineHeart className="w-5 h-5 text-slate-400 hover:text-pink-600" />
                      </button>
                      <button>
                        <MdDeleteOutline
                          className="w-5 h-5 text-slate-400 hover:text-red-600 cursor-pointer"
                          onClick={() => dispatch(removeFromCart(item._id))}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        className="w-[18px] h-[18px] bg-slate-400 rounded-full flex items-center justify-center text-white cursor-pointer"
                        onClick={() => dispatch(decrementQty(item._id))}
                      >
                        <AiOutlineMinus size={12} />
                      </button>

                      <span className="font-semibold text-base">
                        {item.quantity}
                      </span>

                      <button
                        className="w-[18px] h-[18px] bg-slate-800 rounded-full flex items-center justify-center text-white cursor-pointer"
                        onClick={() => dispatch(incrementQty(item._id))}
                      >
                        <AiOutlinePlus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE - SUMMARY */}
            <div className="bg-white rounded-md px-4 py-6 h-max shadow-sm border border-gray-200">
              <ul className="text-slate-500 font-medium space-y-4 text-sm">
                <li className="flex justify-between">
                  Subtotal
                  <span className="font-semibold text-slate-900">
                    {subtotal.toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  Shipping
                  <span className="font-semibold text-slate-900">
                    {shipping.toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  Tax
                  <span className="font-semibold text-slate-900">
                    {tax.toFixed(2)}
                  </span>
                </li>
                <hr className="border-slate-300" />
                <li className="flex justify-between font-semibold text-slate-900">
                  Total <span>{total.toFixed(2)}</span>
                </li>
              </ul>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="mt-8 space-y-4">
                <button
                  className="w-full py-2.5 text-sm font-medium tracking-wide text-white bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-md cursor-pointer transition"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? "Processing..." : "Buy Now"}
                </button>

                <button className="w-full py-2.5 text-sm font-medium tracking-wide text-slate-900 bg-slate-50 hover:bg-slate-100 border border-gray-300 rounded-md">
                  Continue Shopping
                </button>
              </div>

              <div className="mt-5 flex justify-center gap-4">
                <Image src="/Cardsimg/gpay.jpg" alt="gpay" width={40} height={20} />
                <Image src="/Cardsimg/mastercard.png" alt="mc" width={40} height={20} />
                <Image src="/Cardsimg/paypa.png" alt="paypal" width={40} height={20} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-red-500 gap-4">
          <FaShoppingCart className="text-5xl" />
          <p className="text-xl font-bold">Cart is Empty</p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
