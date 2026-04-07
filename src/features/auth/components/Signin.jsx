"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import supabase from "@/lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function Signin() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-12 h-12 border-2 border-slate-100 border-t-black rounded-full animate-spin"></div></div>}>
      <SigninContent />
    </Suspense>
  )
}

function SigninContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || "/profile";

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Sign in failed");
        toast.error(data.message || "Sign in failed");
        return;
      }

      // Trigger WhatsApp Notification for Login
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageType: "login", userEmail: email }),
      }).catch(err => console.error("Notification failed:", err));

      toast.success("Signed in");
      window.location.href = nextParam; // Hard redirect to refresh auth state
    } catch (err) {
      const msg = "Sign in failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4 py-10">
      <Toaster />
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6 transition-all duration-300">
        <div className="text-center">
          <Image
            src="/mayurposhak.png"
            alt="Logo"
            width={100}
            height={40}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">Sign in to your account</h2>
          <p className="text-sm text-gray-500">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSignin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 space-y-1">
          <p>
            {"Don't have an account? "}
            <Link href="/register" className="text-black font-semibold hover:underline">
               Sign up
            </Link>
          </p>
          <p>
            <Link href="/forgot-password" className="text-gray-500 hover:text-black">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
