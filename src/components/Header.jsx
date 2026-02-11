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
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    
    fetchProducts();
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
      <div className="hidden lg:block mb-20">
        <div className="fixed top-0 z-40 bg-white w-full border shadow-sm px-10 py-3 flex justify-between items-center">
          {/* Left */}
          <div className="flex items-center gap-4 relative">
            <CiMenuFries className="text-2xl" />

            <div className="relative w-80">
              <IoSearchOutline className="absolute left-2 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowDropdown(true);
                }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="pl-8 pr-4 py-1.5 border rounded w-full text-sm"
              />

              {showDropdown && searchInput && (
                <div className="absolute top-10 left-0 right-0 bg-white shadow-lg border z-50 max-h-64 overflow-y-auto">
                  {filteredProducts.length ? (
                    filteredProducts.map((p) => (
                      <Link
                        key={p._id}
                        href={`/product/${p._id}`}
                        className="flex gap-3 p-3 hover:bg-gray-100"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 object-contain"
                        />
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-gray-500">
                            ₹{p.price}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="p-3 text-sm text-gray-400">
                      No results found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Logo */}
          <Link href="/">
            <Image
              src="/mayurposhak.png"
              width={180}
              height={50}
              alt="logo"
            />
          </Link>

          {/* Right */}
          <div className="flex items-center gap-5">
            {user ? (
              <Link href="/profile" className="flex items-center gap-2">
                <img
                  src="https://ui-avatars.com/api/?name=User"
                  className="w-8 h-8 rounded-full"
                  alt="user"
                />
                <span className="text-sm">
                  {user.email.split("@")[0]}
                </span>
              </Link>
            ) : (
              <Link href="/Signin">
                <CiUser className="text-2xl" />
              </Link>
            )}

            <Link href="/cart" className="relative">
              <TbShoppingBag className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ================= Desktop Nav ================= */}
        <div className="mt-20 flex justify-center gap-10 py-4 border-t text-sm">
          {navItems.map((item) =>
            item === "SHOP BY CATEGORIES" ? (
              <div key={item} className="relative group cursor-pointer">
                <p className="text-gray-500 hover:text-black">
                  {item}
                </p>

                <div className="absolute top-6 left-0 hidden group-hover:block bg-white shadow-lg border rounded w-40 z-50">
                  {shopCategories.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.link}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item} href={getLink(item)}>
                <p className="text-gray-500 hover:text-black">
                  {item}
                </p>
              </Link>
            )
          )}
        </div>
      </div>

      {/* ================= Mobile Header ================= */}
      <div className="lg:hidden fixed top-0 w-full bg-white z-50 shadow flex items-center justify-between px-4 py-2">
        <CiMenuFries
          className="text-3xl"
          onClick={() => setMenuopen(true)}
        />
        <Image src="/mayurposhak.png" width={120} height={40} alt="logo" />
        <Link href="/cart" className="relative">
          <TbShoppingBag className="text-2xl" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* ================= Mobile Sidebar ================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 h-screen w-80 bg-white z-50 shadow-xl p-5 flex flex-col"
          >
            <RxCross1
              className="text-xl mb-6 cursor-pointer"
              onClick={() => setMenuopen(false)}
            />

            {navItems.map((item) => (
              <div key={item} className="mb-4">
                <Link
                  href={getLink(item)}
                  onClick={() => setMenuopen(false)}
                  className="font-medium block"
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
                        className="text-sm text-gray-500"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-auto flex justify-around pt-6 border-t">
              <FaFacebookF />
              <FaInstagram />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
