"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Arjun Mehta",
    city: "Mumbai",
    rating: 5,
    review:
      "Absolutely love the quality of the sarees! The fabric is silky smooth and the colours are vibrant just like the photos. Will definitely order again.",
    avatar: "AM",
    bg: "bg-rose-50",
  },
  {
    id: 2,
    name: "Priya Sharma",
    city: "Delhi",
    rating: 5,
    review:
      "Ordered a wedding saree and it arrived beautifully packaged. The craftsmanship is exceptional. Got so many compliments at the function!",
    avatar: "PS",
    bg: "bg-amber-50",
  },
  {
    id: 3,
    name: "Meera Patel",
    city: "Ahmedabad",
    rating: 5,
    review:
      "Super fast delivery and the saree matched exactly what was shown. Mayur Poshak is now my go-to brand for traditional wear.",
    avatar: "MP",
    bg: "bg-emerald-50",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const Testimonials = () => {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2 font-medium">
            What Our Customers Say
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Voice of the Community
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className={`${t.bg} rounded-2xl p-8 flex flex-col gap-5 border border-gray-100 transition-all duration-300 cursor-default`}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <FaStar key={idx} className="text-amber-400 text-sm" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-gray-700 text-sm leading-relaxed flex-1">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {[
            { value: "10,000+", label: "Happy Customers" },
            { value: "4.9★", label: "Average Rating" },
            { value: "Pan India", label: "Delivery" },
            { value: "100%", label: "Secure Payments" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-extrabold text-gray-900">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
