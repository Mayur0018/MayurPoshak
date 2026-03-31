"use client";
import React, { useEffect, useState } from "react";
import { CiMenuFries, CiUser } from "react-icons/ci";
import { IoSearchOutline, IoLogOutOutline } from "react-icons/io5";
import { TbShoppingBag } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaFacebookF, FaHeart, FaRegHeart } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { openCartSidebar } from "@/features/cart/cartSlice";
import supabase from "@/lib/supabaseClient";
import SearchOverlay from "../features/SearchOverlay";

const Header = () => {
  const [menuOpen, setMenuopen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const cartCount = useSelector((state) => state.cart.cartItems.length);
  const dispatch = useDispatch();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (user) {
        try {
          const res = await fetch("/api/wishlist");
          const data = await res.json();
          if (Array.isArray(data)) {
            setWishlistCount(data.length);
          }
        } catch (err) {
          console.error("Error fetching wishlist count:", err);
        }
      } else {
        setWishlistCount(0);
      }
    };
    fetchWishlistCount();
  }, [user]);

  /* ---------------- categories ---------------- */
  const shopCategories = [
    { label: "MEN", link: "/men" },
    { label: "LADIES", link: "/ladies" },
    { label: "KIDS", link: "/kids" },
    { label: "GEN Z", link: "/genz" },
  ];

  const navItems = [
    "HOME",
    "ABOUT US",
    "SHOP BY CATEGORIES",
    "CONTACT",
    "BLOGS",
  ];

  const getLink = (label) => {
    switch (label) {
      case "HOME":
        return "/";
      case "ABOUT US":
        return "/About";
      case "CONTACT":
        return "/Contact";
      case "BLOGS":
        return "/blogs";
      default:
        return "/";
    }
  };

  /* ---------------- auth ---------------- */
  useEffect(() => {
    const getUser = async () => {
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

    getUser();
    // Polling or event based updates could be added here,
    // but for now we'll rely on hard redirects on login/logout
  }, []);

  /* ---------------- logout ---------------- */
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Also sign out from supabase if session exists (backward compatibility)
      try {
        await supabase.auth.signOut();
      } catch (e) {}

      window.localStorage.clear();
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
      window.location.href = "/";
    }
  };
  // Lively Logout handling

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 0.4 } },
    exit: { x: "-100%", transition: { duration: 0.4 } },
  };

  return (
    <>
      <SearchOverlay
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* ================= Desktop Header ================= */}
      <div className="hidden lg:block sticky top-0 bg-white/80 backdrop-blur-md z-40 shadow-sm border-b border-gray-100">
        {/* Top Section */}
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 lg:py-4 gap-4">
          {/* Left - Search */}
          <div className="flex-1 max-w-xs lg:max-w-sm">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-lg w-full text-gray-400 hover:border-black hover:text-black transition"
            >
              <IoSearchOutline className="text-lg shrink-0" />
              <span className="text-sm">Search for sarees...</span>
            </button>
          </div>

          {/* Center - Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/mayurposhak.png"
              width={160}
              height={45}
              alt="logo"
              className="h-auto w-auto"
            />
          </Link>

          {/* Right - User & Cart */}
          <div className="flex items-center gap-4 lg:gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-gray-800 transition shadow-sm"
                  >
                    <MdAdminPanelSettings className="text-xs" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 hover:opacity-70 transition"
                >
                  <img
                    src="https://ui-avatars.com/api/?name=User"
                    className="w-8 h-8 rounded-full"
                    alt="user"
                  />
                  <span className="text-xs lg:text-sm font-medium truncate">
                    {user.email.split("@")[0]}
                  </span>
                </Link>
              </div>
            ) : (
              <Link href="/Signin" className="hover:opacity-70 transition">
                <CiUser className="text-xl lg:text-2xl" />
              </Link>
            )}

            <Link
              href="/wishlist"
              className="relative hover:opacity-70 transition border-none bg-transparent cursor-pointer"
            >
              <FaRegHeart className="text-xl lg:text-2xl" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => dispatch(openCartSidebar())}
              className="relative hover:opacity-70 transition border-none bg-transparent cursor-pointer"
            >
              <TbShoppingBag className="text-xl lg:text-2xl" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Nav - Desktop */}
        <div className="border-t border-gray-200 px-4 md:px-6 lg:px-8 py-3">
          <div className="flex justify-center gap-6 lg:gap-12 text-xs lg:text-sm flex-wrap">
            {navItems.map((item) =>
              item === "SHOP BY CATEGORIES" ? (
                <div key={item} className="relative group cursor-pointer">
                  <p className="font-medium text-gray-700 hover:text-black transition">
                    {item}
                  </p>

                  <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg border border-gray-200 rounded-lg w-44 z-50 mt-1">
                    {shopCategories.map((cat) => (
                      <Link
                        key={cat.label}
                        href={cat.link}
                        className="block px-4 py-2 text-xs lg:text-sm text-gray-600 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item} href={getLink(item)}>
                  <p className="font-medium text-gray-700 hover:text-black transition">
                    {item}
                  </p>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>

      {/* ================= Mobile Header ================= */}
      <div className="lg:hidden fixed top-0 w-full bg-white/90 backdrop-blur-md z-40 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-3">
          <button
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition"
            onClick={() => setMenuopen(true)}
          >
            <CiMenuFries className="text-2xl sm:text-3xl" />
          </button>

          <Link href="/" className="flex-1 flex justify-center flex-shrink-0">
            <Image
              src="/mayurposhak.png"
              width={110}
              height={35}
              alt="logo"
              className="h-auto w-auto max-w-[110px] sm:max-w-[130px]"
            />
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1 hover:bg-gray-100 rounded transition border-none bg-transparent"
            >
              <IoSearchOutline className="text-2xl sm:text-3xl text-gray-700" />
            </button>
            <Link
              href="/wishlist"
              className="relative flex-shrink-0 p-1 hover:bg-gray-100 rounded transition border-none bg-transparent"
            >
              <FaRegHeart className="text-2xl sm:text-3xl" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => dispatch(openCartSidebar())}
              className="relative flex-shrink-0 p-1 hover:bg-gray-100 rounded transition border-none bg-transparent"
            >
              <TbShoppingBag className="text-2xl sm:text-3xl" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Space for fixed mobile header */}
      <div className="lg:hidden h-[100px] sm:h-[110px]"></div>

      {/* ================= Mobile Sidebar ================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 h-screen w-72 sm:w-80 bg-white z-40 shadow-xl overflow-y-auto"
          >
            <div className="p-4 sm:p-5 flex flex-col h-full">
              <button
                className="flex justify-end mb-4"
                onClick={() => setMenuopen(false)}
              >
                <RxCross1 className="text-2xl hover:bg-gray-100 p-1 rounded transition" />
              </button>

              <nav className="flex-1">
                {navItems.map((item, index) => (
                  <div key={item}>
                    <div className="py-3">
                      <Link
                        href={getLink(item)}
                        onClick={() => setMenuopen(false)}
                        className="font-semibold text-sm sm:text-base block text-gray-800 hover:text-black transition"
                      >
                        {item}
                      </Link>

                      {item === "SHOP BY CATEGORIES" && (
                        <div className="ml-4 mt-2 flex flex-col gap-2">
                          {shopCategories.map((cat) => (
                            <Link
                              key={cat.label}
                              href={cat.link}
                              onClick={() => setMenuopen(false)}
                              className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 transition"
                            >
                              {cat.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* HR Line */}
                    {index !== navItems.length - 1 && (
                      <hr className="border-gray-200" />
                    )}
                  </div>
                ))}
              </nav>

              {/* User Account Section */}
              <div className="border-t pt-4 mt-4 space-y-3">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMenuopen(false)}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <img
                        src="https://ui-avatars.com/api/?name=User"
                        className="w-8 h-8 rounded-full"
                        alt="user"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">
                          {user.email.split("@")[0]}
                        </span>
                        {user.role === "admin" && (
                          <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
                            Administrator
                          </span>
                        )}
                      </div>
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuopen(false)}
                        className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 font-bold text-sm w-full rounded-lg hover:bg-blue-100 transition"
                      >
                        <MdAdminPanelSettings className="text-xl" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 p-3 text-red-600 font-bold text-sm w-full justify-center bg-red-50 rounded-lg hover:bg-red-100 transition active:scale-95"
                    >
                      <IoLogOutOutline className="text-xl" />
                      Logout Account
                    </button>
                  </>
                ) : (
                  <Link
                    href="/Signin"
                    onClick={() => setMenuopen(false)}
                    className="flex items-center gap-2 p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm w-full justify-center"
                  >
                    <CiUser className="text-xl" />
                    Sign In
                  </Link>
                )}
              </div>

              {/* Social Links */}
              <div className="border-t pt-4 mt-4 flex justify-center gap-6">
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition"
                >
                  <FaFacebookF className="text-lg" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition"
                >
                  <FaInstagram className="text-lg" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
