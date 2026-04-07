"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiPackage, FiTruck, FiMapPin, FiCreditCard, FiArrowLeft, FiCheckCircle, FiClock, FiPhone } from "react-icons/fi";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
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
    const fetchOrder = async () => {
      if (!user || !id) return;
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();
        if (response.ok) {
          setOrder(data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user && id) fetchOrder();
  }, [user, id]);

  const getStatusStep = (status) => {
    const steps = ["Pending", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered"];
    const idx = steps.indexOf(status);
    return idx === -1 ? 1 : idx + 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Link href="/orders" className="text-blue-500 underline mt-4 block">Back to orders</Link>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/orders" className="flex items-center gap-2 text-gray-500 hover:text-black transition mb-8 text-sm">
          <FiArrowLeft /> Back to my orders
        </Link>

        {/* Header Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1">Order Details</p>
              <h1 className="text-2xl font-black text-gray-900">#{order._id?.toUpperCase() || 'N/A'}</h1>
              <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className={`px-4 py-2 rounded-full border text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${
               order.status === "Delivered" ? "bg-green-50 text-green-600 border-green-100" : "bg-black text-white border-black"
            }`}>
              {order.status === "Delivered" ? <FiCheckCircle /> : <FiClock />}
              {order.status}
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="relative pt-8 pb-4">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 rounded-full transition-all duration-1000"
              style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
            ></div>
            
            <div className="relative flex justify-between">
              {["Pending", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered"].map((step, idx) => (
                <div key={step} className="flex flex-col items-center gap-3">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 ${
                    currentStep > idx ? "bg-black border-black text-white" : "bg-white border-gray-100 text-gray-200"
                  }`}>
                    {idx === 0 && <FiClock className="text-xs md:text-base" />}
                    {idx === 1 && <FiPackage className="text-xs md:text-base" />}
                    {idx === 2 && <FiPackage className="text-xs md:text-base" style={{ transform: 'rotate(45deg)' }} />}
                    {idx === 3 && <FiTruck className="text-xs md:text-base" />}
                    {idx === 4 && <FiMapPin className="text-xs md:text-base" />}
                    {idx === 5 && <FiCheckCircle className="text-xs md:text-base" />}
                  </div>
                  <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest text-center max-w-[50px] md:max-w-[80px] ${currentStep > idx ? "text-black" : "text-gray-300"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FiPackage className="text-gray-400" /> Items in Order
              </h2>
              <div className="space-y-6">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-center">
                    <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 shadow-sm">
                      <Image src={item.image} alt={item.name} fill className="object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">Quantity: {item.quantity}</p>
                      <p className="text-sm font-black mt-2">₹{(Number(item.price) || 0).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Extra Info Sidebars */}
          <div className="space-y-8">
            {/* Shipping info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold mb-4 flex items-center gap-2 border-b border-gray-50 pb-4 uppercase tracking-[0.2em] text-gray-400">
                <FiMapPin /> Delivery
              </h2>
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-800">{order.shippingAddress.address}</p>
                <p className="text-sm text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2"><FiPhone className="text-xs" /> {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold mb-4 flex items-center gap-2 border-b border-gray-50 pb-4 uppercase tracking-[0.2em] text-gray-400">
                <FiCreditCard /> Payment
              </h2>
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-800">{order.paymentMethod}</p>
                <div className="space-y-2 border-t border-gray-50 pt-4">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Items Subtotal</span>
                    <span>₹{(Number(order.itemsPrice) || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Shipping</span>
                    <span>{order.shippingPrice === 0 ? "FREE" : `₹${order.shippingPrice}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-50">
                    <span>Total Paid</span>
                    <span>₹{(Number(order.totalPrice) || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-black text-white rounded-3xl p-6 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Need help?</p>
              <h3 className="text-lg font-bold mb-4">Contact our Concierge</h3>
              <p className="text-xs opacity-80 leading-relaxed mb-6">Our experts are available 24/7 to assist with your inquiries regarding order tracking or returns.</p>
              <Link href="/Contact" className="block text-center py-3 border border-white/20 rounded-full text-xs font-bold hover:bg-white hover:text-black transition-all">
                Support Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
