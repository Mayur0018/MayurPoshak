"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbShoppingBag } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";

const recentPurchases = [
  { id: 1, name: "Anita", location: "Mumbai", product: "Silk Anarkali Suit", time: "2 mins ago" },
  { id: 2, name: "Rahul", location: "Delhi", product: "Designer Kurta", time: "5 mins ago" },
  { id: 3, name: "Priya", location: "Bangalore", product: "Chiffon Saree", time: "8 mins ago" },
  { id: 4, name: "Meera", location: "Pune", product: "Embroidered Lehenga", time: "12 mins ago" },
  { id: 5, name: "Vikram", location: "Jaipur", product: "Cotton Nehru Jacket", time: "15 mins ago" },
  { id: 6, name: "Sanya", location: "Hyderabad", product: "Zari Work Saree", time: "1 min ago" },
  { id: 7, name: "Arjun", location: "Chandigarh", product: "Silk Sherwani", time: "10 mins ago" },
];

const SocialProof = () => {
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const randomIndex = Math.floor(Math.random() * recentPurchases.length);
      setCurrentPurchase(recentPurchases[randomIndex]);
      setIsVisible(true);

      const hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 6000);

      return hideTimeout;
    };

    const initialTimeout = setTimeout(() => {
      showNotification();
    }, 10000);

    const interval = setInterval(() => {
      showNotification();
    }, 25000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isVisible && currentPurchase && (
        <motion.div
          key={currentPurchase.id}
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 20, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 left-0 z-[45] p-4 hidden md:block pointer-events-none"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-4 flex items-center gap-4 max-w-[320px] relative pointer-events-auto overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-black/80" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-black transition-colors p-1"
            >
              <RxCross1 size={12} />
            </button>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex-shrink-0">
              <TbShoppingBag size={24} className="text-black" />
            </div>

            <div className="flex flex-col">
              <p className="text-[13px] leading-tight text-gray-800">
                <span className="font-bold text-black">{currentPurchase.name}</span> from <span className="font-semibold">{currentPurchase.location}</span>
              </p>
              <p className="text-[12px] text-gray-500 mt-1">
                Just purchased <span className="text-gray-900 font-medium italic">"{currentPurchase.product}"</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                  Verified Order &bull; {currentPurchase.time}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProof;
