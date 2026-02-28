"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { FiArrowLeft, FiLock, FiTruck, FiMapPin, FiPhone } from "react-icons/fi";
import supabase from "@/lib/supabaseClient";

export default function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price ?? 0) * item.quantity,
    0
  );
  
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const shipping = subtotal >= 999 ? 0 : 49;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, amount: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid coupon");
      setAppliedCoupon(data);
      setCouponError(null);
    } catch (err) {
      setCouponError(err.message);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in to complete your purchase");
      return;
    }

    if (!shippingDetails.address || !shippingDetails.city || !shippingDetails.pincode || !shippingDetails.phone) {
      setError("Please fill in all shipping details");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cartItems, 
          shippingDetails,
          userId: user.id,
          couponId: appliedCoupon?.couponId
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.id) throw new Error(data.error || "Checkout failed");
      
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      setError(err.message || "Checkout failed");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/" className="text-blue-500 underline mt-4 block">Return to shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        
        {/* Left: Shipping Form */}
        <div>
          <Link href="/cart" className="flex items-center gap-2 text-gray-500 hover:text-black transition mb-8 text-sm">
            <FiArrowLeft /> Back to cart
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-500 mb-10">Please provide your shipping details to complete the order.</p>

          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <FiTruck /> Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiMapPin />
                  </span>
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    required
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    required
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    required
                    value={shippingDetails.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiPhone />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    required
                    value={shippingDetails.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6">
              <h3 className="text-sm font-bold mb-3 uppercase tracking-widest text-gray-500">Apply Coupon</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode}
                  className="px-6 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition disabled:opacity-50"
                >
                  {couponLoading ? "..." : "APPLY"}
                </button>
              </div>
              {couponError && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase">{couponError}</p>}
              {appliedCoupon && (
                <div className="flex items-center justify-between mt-3 text-green-600">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Coupon Applied: {appliedCoupon.code}</span>
                  <button onClick={() => setAppliedCoupon(null)} className="text-[10px] font-bold underline">Remove</button>
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm mb-6">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white font-bold rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition shadow-lg"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiLock /> Pay ₹{total.toLocaleString("en-IN")} Securely
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400">By clicking, you agree to our terms and conditions.</p>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-gray-50 rounded-3xl p-8 h-fit lg:sticky top-8">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item._id} className="flex gap-4">
                <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                  <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">{item.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">Size: {item.size || item.selectedSize || "N/A"}</p>
                  <p className="text-sm font-bold mt-2">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Subtotal</span>
              <span className="text-gray-900 font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Shipping</span>
              <span className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600 text-sm font-bold">
                <span>Discount ({appliedCoupon.code})</span>
                <span>-₹{appliedCoupon.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-black">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <FiTruck />
            </div>
            <div>
              <p className="text-sm font-bold">Express Delivery</p>
              <p className="text-xs text-gray-400">Estimated delivery: 3-5 business days</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
