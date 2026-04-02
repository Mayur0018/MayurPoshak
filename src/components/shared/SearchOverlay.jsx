"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { FiArrowRight } from "react-icons/fi";

const SUGGESTIONS = [
  "silk sarees",
  "cotton sarees",
  "party wear",
  "wedding sarees",
  "banarshi sarees",
  "printed sarees",
  "summer sarees",
  "classic designs",
  "men's wear",
  "kids collection",
];

const SearchOverlay = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setProducts([]);
    }
  }, [open]);

  // Fetch all products once
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setAllProducts)
      .catch(() => {});
  }, []);

  // Filter products based on query
  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }
    setLoading(true);
    const q = query.toLowerCase();
    const results = allProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    );
    setProducts(results.slice(0, 6));
    setLoading(false);
  }, [query, allProducts]);

  // Filter suggestions based on query
  const filteredSuggestions = query
    ? SUGGESTIONS.filter((s) => s.includes(query.toLowerCase()))
    : SUGGESTIONS.slice(0, 5);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Search Panel */}
          <motion.div
            className="fixed top-0 left-0 right-0 bg-white z-[110] shadow-2xl pb-6"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Search Input Row */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
              <IoSearchOutline className="text-2xl text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for sarees, categories, brands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-lg text-gray-900 placeholder-gray-300 outline-none bg-transparent"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition px-2"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition shrink-0"
              >
                <RxCross1 className="text-sm text-gray-600" />
              </button>
            </div>

            {/* Results area */}
            <div className="max-h-[70vh] overflow-y-auto">
              {!query ? (
                // No query → show trending suggestions
                <div className="px-6 py-6">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-4">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-black hover:text-black transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-[220px_1fr] min-h-[200px]">
                  {/* Left — Suggestions */}
                  <div className="px-6 py-6 border-r border-gray-100 bg-gray-50">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-4">
                      Suggestions
                    </p>
                    {filteredSuggestions.length > 0 ? (
                      <ul className="flex flex-col gap-2">
                        {filteredSuggestions.map((s) => (
                          <li key={s}>
                            <button
                              onClick={() => setQuery(s)}
                              className="text-sm text-gray-600 hover:text-black transition text-left"
                            >
                              <span className="font-bold text-black">
                                {s.slice(0, query.length)}
                              </span>
                              {s.slice(query.length)}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">No suggestions</p>
                    )}
                  </div>

                  {/* Right — Product Results */}
                  <div className="px-6 py-6">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-4">
                      Products {products.length > 0 && `(${allProducts.filter(p => p.name?.toLowerCase().includes(query.toLowerCase())).length})`}
                    </p>

                    {loading ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="animate-pulse flex gap-3">
                            <div className="w-14 h-14 bg-gray-200 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-2 pt-1">
                              <div className="h-3 bg-gray-200 rounded w-3/4" />
                              <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : products.length > 0 ? (
                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {products.map((p) => (
                          <Link
                            key={p._id}
                            href={`/product/${p._id}`}
                            onClick={onClose}
                            className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition group border border-transparent hover:border-gray-100"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 relative shrink-0 shadow-sm">
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                className="object-cover object-top"
                              />
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                              <p className="text-xs font-semibold text-gray-400 uppercase">
                                Mayur Poshak
                              </p>
                              <p className="text-sm font-medium text-gray-900 group-hover:text-black transition truncate">
                                {p.name}
                              </p>
                              <p className="text-sm font-bold text-gray-900 mt-0.5">
                                ₹{Number(p.price).toLocaleString("en-IN")}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No products found for &ldquo;{query}&rdquo;</p>
                    )}

                    {/* Search all button */}
                    {query && (
                      <button
                        onClick={() => {
                          // Navigate to products page with search query
                          window.location.href = `/products?search=${encodeURIComponent(query)}`;
                          onClose();
                        }}
                        className="mt-6 w-full py-3 bg-black text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition"
                      >
                        Search for &ldquo;{query}&rdquo;
                        <FiArrowRight />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
