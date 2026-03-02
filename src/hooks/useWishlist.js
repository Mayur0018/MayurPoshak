"use client";
import { useState, useEffect, useCallback } from "react";
import supabase from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchWishlist = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      if (Array.isArray(data)) {
        setWishlist(data);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (product) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      router.push("/Signin");
      return;
    }

    const productId = product._id;
    const isAlreadyInWishlist = wishlist.some((item) => item.productId?._id === productId);

    try {
      if (isAlreadyInWishlist) {
        await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        setWishlist((prev) => prev.filter((item) => item.productId?._id !== productId));
        toast.success("Removed from wishlist");
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        // We add local optimistic update or just refetch
        // For simplicity, refetch or add manually
        setWishlist((prev) => [...prev, { productId: { _id: productId } }]);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error("Wishlist operation failed");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.productId?._id === productId);
  };

  return { wishlist, loading, toggleWishlist, isInWishlist };
};
