// app/contact/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen text-black">
      {/* HERO BANNER */}
      <section className="relative w-full h-96 md:h-[650px] overflow-hidden">
        <Image
          src="/Banner/sareesbanner1.jpg"
          alt="Contact Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold">Get In Touch</h1>
            <p className="text-lg md:text-xl mt-2">We're here to help you</p>
          </div>
        </div>
      </section>

      {/* Hero / Header */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-20 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-5 md:px-8 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-serif font-bold tracking-tight"
          >
            Contact Mayur Poshak
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mt-4 text-base md:text-lg text-gray-600 max-w-xl mx-auto"
          >
            We're here to help. Reach out to us for inquiries, custom orders, or just to say hello.
          </motion.p>
        </div>
      </section>

      {/* Main Contact Info */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid md:grid-cols-2 gap-12 md:gap-16"
          >
            {/* Left: Details */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-1">Merchant Legal Entity</h3>
                  <p>MayurPoshak</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-1">Phone</h3>
                  <p className="font-medium">
                    <a href="tel:9106481092" className="hover:text-gray-500 transition">
                      9106481092
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-1">Email</h3>
                  <p className="font-medium">
                    <a href="mailto:mayurnish18@gmail.com" className="hover:text-gray-500 transition">
                      mayurnish18@gmail.com
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-1">Address</h3>
                  <p className="leading-relaxed">
                    168 Jagriti Enclave<br />
                    Delhi - 110092<br />
                    India
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: Message / Map placeholder or note */}
            <motion.div variants={fadeInUp} className="flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
                We'd Love to Hear From You
              </h2>

              <p className="text-gray-700 leading-relaxed mb-8">
                Whether you're looking for custom ethnic wear, have questions about sizing, shipping, or want to collaborate — drop us a line. Our team typically responds within 24–48 hours.
              </p>

              <div className="space-y-4">
                <Link
                  href="mailto:mayurnish18@gmail.com"
                  className="inline-flex items-center justify-center w-full md:w-auto bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition"
                >
                  Send Email →
                </Link>

                <p className="text-sm text-gray-500 text-center md:text-left mt-4">
                  Business Hours: Mon–Sat 10:00 AM – 7:00 PM IST
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Optional subtle background image section or divider */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-5 md:px-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-sm md:text-base text-gray-500 italic max-w-3xl mx-auto"
          >
            "Every garment tells a story. Let’s start yours together."
          </motion.p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-black text-white py-12 md:py-16 text-center">
        <div className="max-w-4xl mx-auto px-5">
          <h3 className="text-xl md:text-2xl font-serif font-bold mb-4">
            Ready to Shop or Customize?
          </h3>
          <Link
            href="/collections"
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition"
          >
            Explore Collections →
          </Link>
        </div>
      </section>
    </div>
  );
}
