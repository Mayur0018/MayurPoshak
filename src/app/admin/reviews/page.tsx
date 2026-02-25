"use client";

import React, { useEffect, useState } from "react";
import { adminDeleteReview } from "@/actions/reviews";
import toast from "react-hot-toast";
import supabase from "@/lib/supabaseClient";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        users (
          full_name,
          email,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch reviews");
    } else {
      setReviews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    const res = await adminDeleteReview(id);
    if (res.ok) {
      toast.success("Review deleted");
      setReviews(reviews.filter((r) => r.id !== id));
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  if (loading) return <div className="p-10">Loading reviews...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((rev) => (
              <tr key={rev.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full" src={rev.users?.avatar_url || `https://ui-avatars.com/api/?name=${rev.users?.full_name || 'U'}`} alt="" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{rev.users?.full_name || "N/A"}</div>
                      <div className="text-sm text-gray-500">{rev.users?.email || "N/A"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rev.rating} / 5</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{rev.comment}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(rev.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(rev.id)} className="text-red-600 hover:text-red-900 font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && <p className="p-10 text-center text-gray-500">No reviews found.</p>}
      </div>
    </div>
  );
}
