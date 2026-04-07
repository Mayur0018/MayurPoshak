"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiPackage, FiTruck, FiChevronRight, FiClock, FiShoppingBag } from "react-icons/fi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
    else setLoading(false);
  }, [user]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "processing": return "bg-amber-50 text-amber-600 border-amber-100";
      case "shipped": return "bg-blue-50 text-blue-600 border-blue-100";
      case "delivered": return "bg-green-50 text-green-600 border-green-100";
      case "cancelled": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <FiPackage className="text-8xl text-gray-200" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sign in to see your orders</h1>
          <p className="text-gray-400 mt-2">Manage your purchases and track shipments.</p>
        </div>
        <Link
          href="/Signin"
          className="px-10 py-3.5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition text-sm"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400 font-medium mb-2 text-center md:text-left">History</p>
          <h1 className="text-4xl font-bold text-gray-900 text-center md:text-left">Your Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6 bg-white rounded-3xl shadow-sm border border-gray-100">
            <FiShoppingBag className="text-8xl text-gray-100" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">No orders yet</h2>
              <p className="text-gray-400 mt-2">{"You haven't placed any orders with us yet."}</p>
            </div>
            <Link
              href="/products"
              className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition text-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, idx) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Order Meta */}
                    <div className="w-full md:w-1/4 space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Order ID</span>
                        <span className="text-sm font-mono text-gray-600">#{order._id?.slice(-8).toUpperCase() || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Placed On</span>
                        <span className="text-sm text-gray-900 font-semibold flex items-center gap-2">
                          <FiClock /> {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Amount</span>
                        <span className="text-lg font-black text-gray-900">₹{(Number(order.totalPrice) || 0).toLocaleString("en-IN")}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest w-fit inline-flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        {order.status}
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {order.orderItems.map((item, i) => (
                        <div key={i} className="relative group flex-shrink-0">
                          <div className="w-20 h-24 relative rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="md:self-center">
                      <Link
                        href={`/orders/${order._id}`}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-900 font-bold text-xs rounded-full hover:bg-black hover:text-white transition-all group"
                      >
                        VIEW DETAILS <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
