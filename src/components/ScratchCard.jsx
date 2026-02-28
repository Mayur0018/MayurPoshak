"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RxCross1 } from "react-icons/rx";
import { FaGift } from "react-icons/fa";
import confetti from "canvas-confetti";

const ScratchCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [revealPercent, setRevealPercent] = useState(0);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Hidden coupon details
  const couponCode = "MAYUR25";
  const discount = "25% OFF";

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = 300;
      canvas.height = 180;

      // Draw the scratch surface
      ctx.fillStyle = "#888"; // Gray scratch surface
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some texture/pattern to the scratch area
      ctx.fillStyle = "#999";
      for (let i = 0; i < 100; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add text to scratch surface
      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#444";
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH TO REVEAL", canvas.width / 2, canvas.height / 2 + 6);
    }
  }, [isOpen]);

  const getPointerPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const scratch = (e) => {
    if (!isDrawing || isScratched) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPointerPos(e);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
    ctx.fill();

    checkReveal();
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparentPixels++;
    }

    const percent = (transparentPixels / (pixels.length / 4)) * 100;
    setRevealPercent(percent);

    if (percent > 50 && !isScratched) {
      setIsScratched(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    alert("Coupon code copied!");
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[45] bg-black text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-4 border-white group"
      >
        <FaGift size={24} />
        <span className="absolute right-full mr-4 bg-black text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          SURPRISE GIFT? 🎁
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              >
                <RxCross1 size={20} />
              </button>

              <div className="p-8 text-center">
                <h3 className="text-2xl font-black text-black tracking-tighter italic">LUCKY SURPRISE!</h3>
                <p className="text-gray-500 mt-2 text-sm">YOU'VE UNLOCKED A SPECIAL REWARD</p>

                <div className="mt-8 relative h-[180px] w-[300px] mx-auto rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                  {/* Underneath Content */}
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase">Your Coupon</p>
                    <p className="text-4xl font-black text-orange-600 mt-1">{discount}</p>
                    <div className="mt-4 bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 inline-flex items-center gap-2">
                       <span className="font-mono font-bold text-lg tracking-wider">{couponCode}</span>
                    </div>
                  </div>

                  {/* Scratchable Layer */}
                  <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 cursor-crosshair touch-none transition-opacity duration-1000 ${isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    onMouseDown={() => setIsDrawing(true)}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseOut={() => setIsDrawing(false)}
                    onMouseMove={scratch}
                    onTouchStart={() => setIsDrawing(true)}
                    onTouchEnd={() => setIsDrawing(false)}
                    onTouchMove={scratch}
                  />
                </div>

                <div className="mt-8 space-y-4">
                  {isScratched ? (
                    <button 
                      onClick={handleCopy}
                      className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-xl"
                    >
                      COPY COUPON & SHOP NOW
                    </button>
                  ) : (
                    <p className="text-sm font-medium text-gray-400 animate-pulse">
                      SCRATCH AT LEAST 50% TO REDEEM
                    </p>
                  )}
                  
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 text-xs font-bold hover:text-black transition-colors"
                  >
                    NO THANKS, I'LL PAY FULL PRICE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScratchCard;
