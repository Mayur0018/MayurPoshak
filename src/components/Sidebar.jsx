"use client";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <nav className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-2 hover:text-gray-300">
          <AiFillHome className="text-xl" />
          Home
        </Link>
        <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-gray-300">
          <MdDashboard className="text-xl" />
          Dashboard
        </Link>
        <Link href="/admin/products" className="flex items-center gap-2 hover:text-gray-300">
          <FaBoxOpen className="text-xl" />
          Products
        </Link>
      </nav>
    </aside>
  );
}
