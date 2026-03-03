"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "@/features/cart/cartSlice";
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

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

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const response = await fetch("/api/wishlist");
      const data = await response.json();
      if (response.ok) {
        // Filter out stale entries where the product was deleted (e.g. after a reseed)
        setWishlist(data.filter((item) => item.productId != null));
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (response.ok) {
        setWishlist(wishlist.filter((item) => item.productId?._id !== productId));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Error removing item");
    }
  };

  const handleAddToCart = (product) => {
    // Note: In real app, we might need a size. Here we just add with a default or redirect to product page
    // For luxury feel, we should probably redirect to product page if size is needed, 
    // but for now let's add it if no size selection is required or prompt for one.
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success("Added to cart");
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
        <FiHeart className="text-8xl text-gray-200" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sign in to see your wishlist</h1>
          <p className="text-gray-400 mt-2">Create an account to save your favorite luxury pieces.</p>
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
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400 font-medium mb-2">Saved Pieces</p>
          <h1 className="text-4xl font-bold text-gray-900">Your Wishlist</h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6 bg-white rounded-3xl shadow-sm border border-gray-100">
            <FiHeart className="text-8xl text-gray-100" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">Your wishlist is empty</h2>
              <p className="text-gray-400 mt-2">Start exploring our collection and save what you love.</p>
            </div>
            <Link
              href="/products"
              className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition text-sm flex items-center gap-2"
            >
              Explore Collection <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {wishlist.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group relative"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(item.productId._id)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-md flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm"
                  >
                    <FiTrash2 size={16} />
                  </button>

                  {/* Product Image */}
                  <Link href={`/product/${item.productId._id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={item.productId.image}
                        alt={item.productId.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                          {item.productId.category}
                        </p>
                        <h3 className="text-sm font-bold text-gray-900 truncate">
                          {item.productId.name}
                        </h3>
                      </div>
                      <p className="text-sm font-black text-gray-900">
                        ₹{(Number(item.productId?.price) || 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="mt-6 flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item.productId)}
                        className="flex-1 bg-black text-white text-[11px] font-bold py-3 rounded-full hover:bg-gray-800 transition flex items-center justify-center gap-2"
                      >
                        <FiShoppingCart /> ADD TO CART
                      </button>
                      <Link
                        href={`/product/${item.productId._id}`}
                        className="px-4 py-3 bg-gray-50 text-gray-900 border border-gray-100 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
                      >
                        <FiArrowRight />
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
