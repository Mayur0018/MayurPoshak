"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      if (error) {
        toast.error(error.message);
        return;
      }

      // If backend returns a user/session, redirect to profile
      if (data?.user || data?.session) {
        toast.success("Signup successful — redirecting...");
        router.push("/profile");
      } else {
        toast.success("Signup successful — check your email to confirm");
      }
    } catch (err) {
      toast.error(err?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <Image src="/mayurposhak.png" alt="Logo" width={100} height={30} className="mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Sign Up</h2>
        </div>
        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 transition">
            Register
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/Signin" className="text-black font-medium hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
