"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchWishlist = useCallback(async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        setWishlist([]);
        setLoading(false);
        return;
      }
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
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        toast.error("Please sign in to add to wishlist");
        router.push("/Signin");
        return;
      }

      const productId = product._id;
      const isAlreadyInWishlist = wishlist.some((item) => item.productId?._id === productId);

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
        setWishlist((prev) => [...prev, { productId: { _id: productId } }]);
        toast.success("Added to wishlist");
      }

      // Notify header badge to refresh
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      toast.error("Wishlist operation failed");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.productId?._id === productId);
  };

  return { wishlist, loading, toggleWishlist, isInWishlist };
};
