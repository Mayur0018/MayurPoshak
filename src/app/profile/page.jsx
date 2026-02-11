"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (error || !data?.user) {
        router.push("/Signin");
      } else {
        setUser(data.user);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/Signin");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600"></div>
      </div>
    );

  const avatar =
    user.user_metadata?.avatar_url ||
    "https://pagedone.io/asset/uploads/1705471668.png";

  const fullName = user.user_metadata?.full_name || user.email;

  return (
    <section className="relative pt-36 pb-24 bg-gray-50 min-h-screen">
      {/* Background image */}
      <img
        src="https://pagedone.io/asset/uploads/1705471739.png"
        alt="cover"
        className="w-full absolute top-0 left-0 z-0 h-60 object-cover"
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Avatar */}
        <div className="flex items-center justify-center mb-6">
          <img
            src={avatar}
            alt="user"
            className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-white rounded-full object-cover"
          />
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 text-center sm:text-left">
          <ul className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm sm:text-base">
            <Link href="/">
              <li className="text-gray-900 font-medium cursor-pointer">Home</li>
            </Link>
            <li className="text-gray-500 cursor-pointer">Account</li>
            <li className="text-gray-500 flex gap-2 items-center cursor-pointer">
              Profile{" "}
              <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                New
              </span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="rounded-full border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-900 hover:bg-gray-100 transition">
              Message
            </button>
            <button className="rounded-full border border-indigo-600 bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 transition">
              Book a Session
            </button>
          </div>
        </div>

        {/* User Info */}
        <h3 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {fullName}
        </h3>
        <p className="text-center text-sm sm:text-base text-gray-500 mb-8">
          A social media influencer and singer
        </p>

        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold hover:underline text-sm sm:text-base cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}
