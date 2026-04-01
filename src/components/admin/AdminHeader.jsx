"use client";

import { TfiBell, TfiMenu } from "react-icons/tfi";
import toast from "react-hot-toast";

export default function AdminHeader({ onMenuClick }) {
  return (
    <header className="px-4 md:px-8 mb-8 sticky top-0 z-40 bg-[#f8fafc]/80 backdrop-blur-xl py-4 md:py-6 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-2 md:p-3 pl-4 md:pl-8 pr-4 md:pr-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl transition"
          >
            <TfiMenu className="text-lg" />
          </button>
          
          <h2 className="hidden lg:block text-xs font-black uppercase tracking-[0.3em] text-slate-300">
            System Administration
          </h2>
        </div>

        <div className="flex items-center gap-6 md:gap-8">
          <button 
            onClick={() => toast("You have 3 new system alerts.", { icon: "🔔" })}
            className="relative p-2 text-slate-400 hover:text-black transition"
          >
            <TfiBell className="text-lg" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          <div className="h-8 w-px bg-slate-200" />

          <div className="flex items-center gap-3 md:gap-4 ml-2 md:ml-0">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Administrator</p>
              <p className="text-[10px] md:text-[11px] text-slate-400 font-medium whitespace-nowrap">Verified Account</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-black italic text-sm text-slate-900 shadow-sm">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
