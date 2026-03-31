"use client";

import { useState, useEffect, useRef } from "react";
import { TfiSearch, TfiBell } from "react-icons/tfi";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminHeader() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        const res = await fetch(`/api/admin/search?q=${query}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setShowResults(true);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <header className="px-8 mb-8 sticky top-0 z-40 bg-[#f8fafc]/80 backdrop-blur-xl py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/40 border border-white/60 rounded-3xl p-3 pl-8 pr-6 shadow-sm">
        <div className="flex items-center gap-4 flex-1 relative" ref={searchRef}>
          <TfiSearch className="text-slate-400 text-sm" />
          <input
            placeholder="Search products, orders, users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowResults(true)}
            className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full max-w-md placeholder:text-slate-300"
          />

          {showResults && results.length > 0 && (
            <div className="absolute top-14 left-0 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
              <div className="p-2 space-y-1">
                {results.map((res) => (
                  <Link
                    key={res.id}
                    href={res.href}
                    onClick={() => setShowResults(false)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors group"
                  >
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{res.type}</p>
                      <p className="text-sm font-bold text-slate-900">{res.label}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <TfiSearch className="text-[10px]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => toast("You have 3 new system alerts.", { icon: "🔔" })}
            className="relative p-2 text-slate-400 hover:text-black transition"
          >
            <TfiBell className="text-lg" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          <div className="h-8 w-px bg-slate-200" />

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest">Administrator</p>
              <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Verified System Account</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black italic">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
