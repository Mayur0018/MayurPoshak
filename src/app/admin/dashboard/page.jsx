"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center uppercase tracking-widest text-[10px] font-bold text-gray-400">Loading Dashboard...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1">Overview</p>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Enterprise Dashboard</h1>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, color: "bg-black text-white" },
          { label: "Total Orders", value: stats?.totalOrders || 0, color: "bg-white border text-black" },
          { label: "Active Users", value: stats?.totalUsers || 0, color: "bg-white border text-black" },
          { label: "Total Products", value: stats?.totalProducts || 0, color: "bg-white border text-black" },
        ].map((item, i) => (
          <div key={i} className={`p-6 rounded-2xl shadow-sm transition-transform hover:scale-[1.02] duration-300 ${item.color}`}>
            <p className="text-[9px] uppercase tracking-widest font-black opacity-60 mb-2">{item.label}</p>
            <p className="text-2xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[10px] font-bold text-blue-600 uppercase hover:underline">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="pb-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Order ID</th>
                  <th className="pb-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Customer</th>
                  <th className="pb-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                  <th className="pb-4 text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="group hover:bg-gray-50 transition">
                    <td className="py-4 text-[11px] font-bold text-gray-500 uppercase">#{order._id?.slice(-6)}</td>
                    <td className="py-4 text-xs font-bold text-slate-800">{order.shippingAddress?.fullName || "Guest"}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-black text-right tracking-tight italic">₹{order.totalPrice?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Revenue Chart Substitute */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8">
           <h2 className="text-sm font-black uppercase tracking-widest mb-8">Revenue Trend</h2>
           <div className="space-y-6">
              {stats?.monthlyRevenue?.map((m, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span>Month {m._id}</span>
                      <span>₹{m.revenue.toLocaleString()}</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-black rounded-full" 
                        style={{ width: `${Math.min(100, (m.revenue / (stats.totalRevenue || 1)) * 300)}%` }}
                      ></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
