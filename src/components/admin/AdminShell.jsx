"use client";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminShell({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans overflow-x-hidden">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col pt-4 w-full">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Content Box */}
        <div className="flex-1 px-4 md:px-8 pb-12 w-full">
           <div className="max-w-7xl mx-auto">
              {children}
           </div>
        </div>
      </main>
    </div>
  );
}
