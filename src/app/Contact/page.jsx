// app/contact/page.tsx
"use client";

import React, { useState } from "react";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-white min-h-screen text-black">
      {/* HERO BANNER */}
      <section className="relative w-full h-80 md:h-96 overflow-hidden">
        <Image
          src="/Banner/banner3.jpg"
          alt="Contact Mayur Poshak"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-2">Get In Touch</h1>
            <p className="text-lg md:text-xl">We're here to help with your saree needs</p>
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
            We're here to help. Reach out for inquiries, custom orders, sizing help, or any questions about our collections.
          </motion.p>
        </div>
      </section>

      {/* Main Contact Info Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {/* Phone */}
            <motion.div
              variants={fadeInUp}
              className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4 text-red-600">📞</div>
              <h3 className="text-xl font-semibold text-black mb-3">Phone</h3>
              <p className="text-gray-600 mb-4">Call us directly for quick inquiries</p>
              <a
                href="tel:+918800870709"
                className="inline-block bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition"
              >
                +91 88008 70709
              </a>
            </motion.div>

            {/* Email */}
            <motion.div
              variants={fadeInUp}
              className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4 text-red-600">✉️</div>
              <h3 className="text-xl font-semibold text-black mb-3">Email</h3>
              <p className="text-gray-600 mb-4">Send us an email anytime</p>
              <a
                href="mailto:mayurposhak.in@gmail.com"
                className="inline-block bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition"
              >
                mayurposhak.in@gmail.com
              </a>
            </motion.div>

            {/* Address */}
            <motion.div
              variants={fadeInUp}
              className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4 text-red-600">📍</div>
              <h3 className="text-xl font-semibold text-black mb-3">Location</h3>
              <p className="text-gray-600 mb-4">Visit us in Delhi</p>
              <p className="font-medium text-sm text-gray-700">
                168 Jagriti Enclave<br />
                Delhi - 110092<br />
                India
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form + Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid md:grid-cols-2 gap-12 md:gap-16"
          >
            {/* Contact Form */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Right: Info + Services */}
            <motion.div variants={fadeInUp} className="flex flex-col justify-start">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
                We'd Love to Hear From You
              </h2>

              <p className="text-gray-700 leading-relaxed mb-8">
                Whether you're looking for custom ethnic wear, have questions about sizing, shipping, or want to collaborate — we're here to help. Our team typically responds within 24–48 hours.
              </p>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">What We Can Help With:</h3>
                
                <div className="space-y-3">
                  {[
                    "Custom saree orders & tailoring",
                    "Sizing and fitting assistance",
                    "Product recommendations",
                    "Shipping & delivery inquiries",
                    "Bulk orders & corporate gifts",
                    "Care and maintenance tips",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">✓</span>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-red-50 rounded-lg p-4 mt-8">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-black">Business Hours:</span><br />
                    Mon–Sat: 10:00 AM – 7:00 PM IST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-5 md:px-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-sm md:text-base text-gray-500 italic max-w-3xl mx-auto"
          >
            "Every garment tells a story. Let's start yours together. We're committed to providing the best service and helping you find the perfect saree for every occasion."
          </motion.p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-black text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
            Ready to Explore Our Collections?
          </h3>
          <p className="text-gray-300 mb-8">Browse our exclusive saree collections and find your perfect match.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/ladies"
              className="inline-block bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition"
            >
              Shop Sarees
            </Link>
            <Link
              href="/blogs"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-black transition"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}