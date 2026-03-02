"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const NewsletterCTA = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("🎉 You're subscribed! Welcome to the Mayur Poshak family.");
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden bg-black py-20 px-6">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-3 font-medium">
            Stay in the Loop
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Join the Mayur Poshak<br />Movement
          </h2>
          <p className="text-gray-400 mb-10 text-sm md:text-base max-w-md mx-auto">
            Get exclusive offers, early access to new collections, and styling tips delivered straight to your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-100 transition-all duration-300 whitespace-nowrap shrink-0"
            >
              Subscribe →
            </button>
          </form>

          <p className="text-gray-600 text-xs mt-5">
            No spam, ever. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
