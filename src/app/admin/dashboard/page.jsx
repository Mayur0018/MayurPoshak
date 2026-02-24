"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = res.ok ? await res.json() : [];
        setProducts(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const total = products.length;
  const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0);
  const avgPrice = total ? Math.round((totalValue / total) * 100) / 100 : 0;
  const latest = products.slice(-6).reverse();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-gray-600">Total Products</div>
          <div className="text-2xl font-semibold mt-1">{total}</div>
        </div>
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-gray-600">Average Price</div>
          <div className="text-2xl font-semibold mt-1">₹{avgPrice.toFixed(2)}</div>
        </div>
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-gray-600">Inventory Value</div>
          <div className="text-2xl font-semibold mt-1">₹{Math.round(totalValue).toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Latest Products</h2>
          <Link href="/admin/products" className="text-sm underline">Manage</Link>
        </div>
        {loading ? (
          <div className="text-sm text-gray-600 mt-3">Loading...</div>
        ) : latest.length === 0 ? (
          <div className="text-sm text-gray-600 mt-3">No products yet</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {latest.map((p, idx) => (
              <div key={p._id || `${p.name}-${idx}`} className="border rounded overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-28 object-cover" />
                ) : (
                  <div className="w-full h-28 bg-gray-100" />
                )}
                <div className="p-2">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-gray-600 mt-1">₹{Number(p.price || 0).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
