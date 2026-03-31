"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TfiDashboard,
  TfiPackage,
  TfiReceipt,
  TfiUser,
  TfiCommentAlt,
  TfiTicket,
  TfiStatsUp,
  TfiSettings,
  TfiPowerOff
} from "react-icons/tfi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminSidebar() {
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
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col z-50">
      <div className="p-10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black italic text-xl shadow-lg">
            M
          </div>
          <span className="text-sm font-black uppercase tracking-[0.3em] italic">
            Mayur Poshak
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto mt-4">
        <p className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
          Management
        </p>
        {NavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-black text-white shadow-xl translate-x-1"
                  : "text-slate-500 hover:bg-slate-50 hover:text-black"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon
                  className={`text-base transition-transform duration-300 ${
                    !isActive && "group-hover:scale-110"
                  }`}
                />
                <span className="text-[11px] font-bold uppercase tracking-widest leading-none">
                  {item.label}
                </span>
              </div>
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? "bg-white" : "bg-black opacity-0 group-hover:opacity-100"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      <div className="p-10 border-t border-slate-50">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-4 text-slate-400 hover:text-red-500 transition-colors w-full group"
        >
          <TfiPowerOff className="text-lg group-hover:rotate-12 transition-transform" />
          <span className="text-[11px] font-bold uppercase tracking-widest">
            Global Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
