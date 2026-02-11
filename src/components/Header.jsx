"use client";
import React, { useEffect, useState } from "react";
import { CiMenuFries, CiUser } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { TbShoppingBag } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import supabase from "@/lib/supabaseClient";

const Header = () => {
  const [menuOpen, setMenuopen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const cartCount = useSelector((state) => state.cart.cartItems.length);

  /* ---------------- categories ---------------- */
  const shopCategories = [
    { label: "MEN", link: "/men" },
    { label: "LADIES", link: "/ladies" },
    { label: "KIDS", link: "/kids" },
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

  /* ---------------- products search ---------------- */
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const filteredProducts = products.filter((item) =>
    item.name?.toLowerCase().includes(searchInput.toLowerCase())
  );

  /* ---------------- auth ---------------- */
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    getUser();
    const { data: authListener } =
      supabase.auth.onAuthStateChange(getUser);

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 0.4 } },
    exit: { x: "-100%", transition: { duration: 0.4 } },
  };

  return (
    <>
      {/* ================= Desktop Header ================= */}
      <div className="hidden lg:block sticky top-0 bg-white z-40 shadow-sm">
        {/* Top Section */}
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 lg:py-4 gap-4">
          {/* Left - Search */}
          <div className="flex-1 max-w-xs lg:max-w-sm">
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search sarees..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowDropdown(true);
                }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />

              {showDropdown && searchInput && (
                <div className="absolute top-12 left-0 right-0 bg-white shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto rounded-lg">
                  {filteredProducts.length ? (
                    filteredProducts.map((p) => (
                      <Link
                        key={p._id}
                        href={`/product/${p._id}`}
                        className="flex gap-3 p-3 hover:bg-gray-100 border-b"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 object-contain"
                        />
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-gray-500">₹{p.price}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="p-3 text-sm text-gray-400">No results found</p>
                  )}
                </div>
              )}
            </div>
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
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-70 transition">
                <img
                  src="https://ui-avatars.com/api/?name=User"
                  className="w-8 h-8 rounded-full"
                  alt="user"
                />
                <span className="text-xs lg:text-sm font-medium truncate">
                  {user.email.split("@")[0]}
                </span>
              </Link>
            ) : (
              <Link href="/Signin" className="hover:opacity-70 transition">
                <CiUser className="text-xl lg:text-2xl" />
              </Link>
            )}

            <Link href="/cart" className="relative hover:opacity-70 transition">
              <TbShoppingBag className="text-xl lg:text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
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
              )
            )}
          </div>
        </div>
      </div>

      {/* ================= Mobile Header ================= */}
      <div className="lg:hidden fixed top-0 w-full bg-white z-50 shadow-md">
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

          <Link href="/cart" className="relative flex-shrink-0 p-1 hover:bg-gray-100 rounded transition">
            <TbShoppingBag className="text-2xl sm:text-3xl" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Search Bar */}
        <div className="border-t border-gray-200 px-3 sm:px-4 py-2">
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowDropdown(true);
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            {showDropdown && searchInput && (
              <div className="absolute top-12 left-0 right-0 bg-white shadow-lg border border-gray-200 z-50 max-h-48 overflow-y-auto rounded-lg">
                {filteredProducts.length ? (
                  filteredProducts.map((p) => (
                    <Link
                      key={p._id}
                      href={`/product/${p._id}`}
                      onClick={() => setShowDropdown(false)}
                      className="flex gap-2 p-2 sm:p-3 hover:bg-gray-100 border-b text-sm"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-gray-500">₹{p.price}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="p-2 sm:p-3 text-xs sm:text-sm text-gray-400">No results</p>
                )}
              </div>
            )}
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

              <nav className="flex-1 space-y-3 sm:space-y-4">
                {navItems.map((item) => (
                  <div key={item} className="space-y-2">
                    <Link
                      href={getLink(item)}
                      onClick={() => setMenuopen(false)}
                      className="font-semibold text-sm sm:text-base block text-gray-800 hover:text-black transition"
                    >
                      {item}
                    </Link>

                    {item === "SHOP BY CATEGORIES" && (
                      <div className="ml-4 flex flex-col gap-2">
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
                ))}
              </nav>

              {/* User Account Section */}
              <div className="border-t pt-4 mt-4">
                {user ? (
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
                    <span className="text-sm font-medium truncate">
                      {user.email.split("@")[0]}
                    </span>
                  </Link>
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
                <a href="#" className="text-gray-600 hover:text-black transition">
                  <FaFacebookF className="text-lg" />
                </a>
                <a href="#" className="text-gray-600 hover:text-black transition">
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
