"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  TfiDashboard,
  TfiPackage,
  TfiReceipt,
  TfiUser,
  TfiCommentAlt,
  TfiTicket,
  TfiStatsUp,
  TfiSettings,
  TfiPowerOff,
  TfiClose,
  TfiMenu
} from "react-icons/tfi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    toast.success("Signed out successfully");
    router.push("/Signin");
  };

  const NavItems = [
    { label: "Dashboard", href: "/admin", icon: TfiDashboard },
    { label: "Products", href: "/admin/products", icon: TfiPackage },
    { label: "Orders", href: "/admin/orders", icon: TfiReceipt },
    { label: "Users", href: "/admin/users", icon: TfiUser },
    { label: "Reviews", href: "/admin/reviews", icon: TfiCommentAlt },
    { label: "Coupons", href: "/admin/coupons", icon: TfiTicket },
    { label: "Analytics", href: "/admin/analytics", icon: TfiStatsUp },
    { label: "Settings", href: "/admin/settings", icon: TfiSettings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-screen w-72 bg-black border-r border-white/5 flex flex-col z-[60] transition-transform duration-500 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8 pb-10 flex items-center justify-between">
          <Link href="/admin" className="block w-full max-w-[200px]" onClick={onClose}>
            <Image
              src="/mayurposhak.png"
              width={180}
              height={50}
              alt="Mayur Poshak"
              className="h-auto w-full brightness-0 invert"
            />
          </Link>
          <button className="lg:hidden text-white p-2 hover:bg-white/10 rounded-xl" onClick={onClose}>
            <TfiClose className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto mt-4 no-scrollbar">
          <p className="px-5 text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-6">
            Management
          </p>
          {NavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 ${
                  isActive
                    ? "bg-white text-black shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] scale-[1.02]"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-5">
                  <item.icon
                    className={`text-lg transition-transform duration-500 ${
                      !isActive && "group-hover:scale-125"
                    }`}
                  />
                  <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                    {item.label}
                  </span>
                </div>
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    isActive ? "bg-black" : "bg-white opacity-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="p-10 border-t border-white/5">
          <button 
            onClick={() => { handleSignOut(); onClose(); }}
            className="flex items-center gap-5 text-white/30 hover:text-red-500 transition-all w-full group py-2"
          >
            <TfiPowerOff className="text-xl group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-[11px] font-black uppercase tracking-widest">
              Global Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
