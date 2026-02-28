"use client";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { makeAdmin } from "@/actions/auth";

export default function DebugAuthPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, []);

  async function handlePromote() {
    if (!user) return;
    setBtnLoading(true);
    try {
      await makeAdmin(user.id, user.email);
      setMsg("SUCCESS! You are now an Admin in the database. Please LOG OUT and LOG IN again to refresh your session.");
    } catch (err) {
      setMsg("Error: " + err.message);
    } finally {
      setBtnLoading(false);
    }
  }

  if (loading) return <div className="p-10">Loading auth state...</div>;

  return (
    <div className="p-10 font-mono text-sm max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Auth Debugger & Fixer</h1>
      
      {msg && (
        <div className={`p-4 mb-6 rounded border ${msg.startsWith('Error') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
          {msg}
        </div>
      )}

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">User Status</h2>
          <div className="grid grid-cols-[150px_1fr] gap-2">
            <span className="font-bold">User ID:</span> <span>{user?.id || "Not logged in"}</span>
            <span className="font-bold">Email:</span> <span>{user?.email || "N/A"}</span>
            <span className="font-bold text-red-600">Admin Role:</span> 
            <span className={`font-bold ${user?.user_metadata?.role === 'admin' ? 'text-green-600' : 'text-red-600'}`}>
              {user?.user_metadata?.role || "MISSING"}
            </span>
          </div>
        </section>

        {user && user.user_metadata?.role !== 'admin' && (
          <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-lg font-bold mb-2">Access Fixer</h2>
            <p className="mb-4">Click the button below to force-promote your account to Administrative status.</p>
            <button
              onClick={handlePromote}
              disabled={btnLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {btnLoading ? "Processing..." : "🚀 MAKE ME ADMIN"}
            </button>
          </section>
        )}

        <section className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-lg font-bold mb-2">Raw Metadata</h2>
          <pre className="mt-2 bg-white p-4 border rounded overflow-auto max-h-64 text-xs">
            {JSON.stringify(user?.user_metadata, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}
