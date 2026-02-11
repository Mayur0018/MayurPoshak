// app/about/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function AboutUs() {
  return (
    <div className="bg-white text-black min-h-screen">
      {/* HERO BANNER */}
      <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <Image
          src="/Banner/sareesbanner.jpg"
          alt="Mayur Poshak"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold">Mayur Poshak</h1>
            <p className="text-lg md:text-xl mt-2">Where Tradition Meets Innovation</p>
          </div>
        </div>
      </section>

      {/* Hero - Compact & Centered */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-20 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-5 md:px-8 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="text-4xl md:text-5xl font-serif font-bold tracking-tight"
          >
            About Us
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="mt-5 text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed"
          >
            Tradition reimagined. Not for everyone — just for those who dare to
            stand out.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="mt-8"
          >
            <Link
              href="/ladies"
              className="inline-block bg-black text-white px-7 py-3 text-sm md:text-base font-medium rounded-full hover:bg-gray-800 transition"
            >
              View Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Visual Statement - Smaller centered image */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            className="mt-8 text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto italic"
          >
            Every thread carries a story. Every print breaks a rule.
          </motion.p>
        </div>
      </section>

      {/* Brand Essence - Unique staggered columns */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
            >
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-5">
                Born in Ahmedabad
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                From the vibrant lanes where heritage meets hustle, Mayur Poshak
                emerged as a quiet rebellion against ordinary ethnic wear. We
                started small — with love for handloom, bold prints, and
                fearless design.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              className="md:mt-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-5">
                Made Differently
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                We don't chase trends. We craft pieces that speak — sometimes
                softly, sometimes loudly. Offbeat patterns, unexpected textures,
                modern cuts on traditional souls. For the woman who wears her
                identity, not someone else's.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Beliefs - Compact cards */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-10 md:mb-14">
            What We Stand For
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { title: "Craft", desc: "Handmade with intention" },
              { title: "Bold", desc: "Prints that provoke" },
              { title: "Real", desc: "No fast fashion illusions" },
              { title: "You", desc: "Designed for your story" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideUp}
                className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 text-center hover:shadow-md transition"
              >
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Call */}
      <section className="bg-black text-white py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto px-5">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            className="text-3xl md:text-4xl font-serif font-bold"
          >
            Be Unapologetically You
          </motion.h2>
          <p className="mt-5 text-base md:text-lg text-gray-300">
            Mayur Poshak isn't just clothing — it's quiet confidence wrapped in
            bold expression.
          </p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            className="mt-10"
          >
            <Link
              href="/collections"
              className="inline-block bg-white text-black px-8 py-4 text-base md:text-lg font-medium rounded-full hover:bg-gray-100 transition"
            >
              Start Here →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
