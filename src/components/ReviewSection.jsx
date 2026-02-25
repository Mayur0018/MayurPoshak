"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiFillStar, AiOutlineStar, AiOutlineCamera, AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "@/lib/supabaseClient";
import toast from "react-hot-toast";

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchReviews();
    checkUser();
  }, [productId]);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data?.user || null);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?product_id=${productId}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data);
      } else {
        console.error("Failed to fetch reviews:", data.error);
        if (data.error?.includes("bigint")) {
           toast.error("Database error: Product ID mismatch. Please check Supabase schema.");
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Could not load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        const newImages = data.images.map((img) => img.secure_url);
        setImages((prev) => [...prev, ...newImages]);
        toast.success("Images uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to write a review");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          rating,
          title,
          comment,
          images,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Review submitted!");
        setShowForm(false);
        fetchReviews();
        // Reset form
        setRating(5);
        setTitle("");
        setComment("");
        setImages([]);
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      toast.error("Submission failed");
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-16 border-t pt-10 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                i < Math.round(Number(averageRating)) ? <AiFillStar key={i} /> : <AiOutlineStar key={i} />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-600">
              {averageRating} out of 5 ({reviews.length} reviews)
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition"
        >
          {showForm ? "Cancel Review" : "Write a Review"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-10 bg-slate-50 p-6 rounded-xl border border-slate-200"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Rating</label>
                <div className="flex gap-1 text-2xl text-yellow-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="hover:scale-110 transition"
                    >
                      {s <= rating ? <AiFillStar /> : <AiOutlineStar />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Review Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Example: Great quality, beautiful saree!"
                    className="p-3 border rounded-md text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Photos (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded border overflow-hidden">
                        <img src={img} alt="review-upload" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                        >
                          <AiOutlineClose size={12} />
                        </button>
                      </div>
                    ))}
                    <label className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded cursor-pointer hover:border-slate-500 transition">
                      <AiOutlineCamera className="text-xl text-slate-500" />
                      <span className="text-[10px] text-slate-500 mt-1">Add</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Details</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike?"
                  className="p-3 border rounded-md text-sm min-h-[120px] focus:ring-2 focus:ring-slate-900 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="px-8 py-3 bg-slate-900 text-white rounded-md font-semibold hover:bg-slate-800 disabled:bg-slate-400 transition"
              >
                {uploading ? "Uploading images..." : "Submit Review"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-slate-500 py-10">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="border-b pb-8 last:border-0">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={rev.users?.avatar_url || `https://ui-avatars.com/api/?name=${rev.users?.full_name || 'User'}`}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="avatar"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{rev.users?.full_name || "Verified Customer"}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        i < rev.rating ? <AiFillStar key={i} /> : <AiOutlineStar key={i} />
                      ))}
                    </div>
                    {rev.is_verified_purchase && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase transition hover:scale-105 cursor-default mt-1">Verified Purchase</span>
                    )}
                  </div>
                </div>
              </div>
              <h5 className="font-bold text-slate-900 mb-1">{rev.title}</h5>
              <p className="text-sm text-slate-600 mb-4">{rev.comment}</p>
              
              {rev.images && rev.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {rev.images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                      <img src={img} alt="review-image" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-[10px] text-slate-400 mt-2">
                Reviewed on {new Date(rev.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
