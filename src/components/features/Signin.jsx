"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import supabase from "@/lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }

      // If sign-in returns a session, redirect to profile
      if (data?.session) {
        // Trigger WhatsApp Notification for Login
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageType: "login", userEmail: email }),
        });

        toast.success("Signed in");
        router.push("/profile");
      } else {
        // For magiclink or other flows
        toast.success("Check your email for sign-in link");
      }
    } catch (err) {
      const msg = err?.message || "Sign in failed";
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
            Don&apos;t have an account?{" "}
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
