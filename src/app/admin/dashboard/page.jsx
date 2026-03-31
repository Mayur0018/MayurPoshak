"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { 
  TfiWallet, 
  TfiShoppingCart, 
  TfiUser, 
  TfiPackage,
  TfiAngleRight,
  TfiPulse,
  TfiAlert
} from "react-icons/tfi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExport = () => {
    if (!stats) return;
    const csvContent = [
      ["Metric", "Value"],
      ["Total Revenue", stats.totalRevenue],
      ["Total Orders", stats.totalOrders],
      ["Active Users", stats.totalUsers],
      ["Inventory", stats.totalProducts],
      [],
      ["Month", "Revenue"],
      ...stats.monthlyRevenue.map(m => [new Date(0, m._id-1).toLocaleString('default', { month: 'long' }), m.revenue])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `mayur_poshak_stats_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-2 border-slate-100 border-t-black rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Data...</p>
      </div>
    );
  }

  const statConfig = [
    { label: "Total Revenue", value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon: TfiWallet, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: TfiShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active Users", value: stats?.totalUsers || 0, icon: TfiUser, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Inventory", value: stats?.totalProducts || 0, icon: TfiPackage, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">System Overview</h1>
          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Real-time performance metrics</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
           <button 
             onClick={fetchStats}
             className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition shadow-lg hover:bg-slate-800 disabled:opacity-50"
             disabled={loading}
           >
             Refresh
           </button>
           <button 
             onClick={handleExport}
             className="px-6 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-black transition"
           >
             Export
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statConfig.map((item, i) => (
          <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
              <item.icon className="text-2xl" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">{item.label}</p>
            <p className="text-3xl font-black tracking-tighter">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
               <h2 className="text-sm font-black uppercase tracking-[0.2em]">Transaction Log</h2>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Latest storefront activity</p>
            </div>
            <Link href="/admin/orders" className="flex items-center gap-2 group text-[10px] font-black uppercase tracking-widest text-indigo-600">
               View All <TfiAngleRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="overflow-x-auto overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-6 text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">Reference</th>
                  <th className="pb-6 text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">Customer</th>
                  <th className="pb-6 text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">Fulfillment</th>
                  <th className="pb-6 text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="group hover:bg-slate-50 transition-colors duration-300">
                    <td className="py-6 text-[11px] font-black text-slate-400 tracking-widest">#{order._id?.slice(-8).toUpperCase()}</td>
                    <td className="py-6">
                       <p className="text-xs font-black text-slate-900 uppercase">{order.shippingAddress?.fullName || order.shippingAddress?.phone || "Customer"}</p>
                       <p className="text-[10px] text-slate-400 font-medium">{order.shippingAddress?.city || "Verified Order"}</p>
                    </td>
                    <td className="py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] ${
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-6 text-xs font-black text-right tracking-tighter italic text-slate-900">₹{order.totalPrice?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Visualization */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
           <TfiPulse className="absolute -top-10 -right-10 text-[12rem] text-slate-50 opacity-50" />
           <div className="relative z-10">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-10">Revenue Streams</h2>
              <div className="space-y-8">
                 {stats?.monthlyRevenue?.map((m, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Month</p>
                            <p className="text-xs font-black uppercase italic">{new Date(0, m._id-1).toLocaleString('default', { month: 'long' })}</p>
                         </div>
                         <p className="text-sm font-black tracking-widest">₹{m.revenue.toLocaleString()}</p>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-black rounded-full transition-all duration-1000" 
                           style={{ width: `${Math.min(100, (m.revenue / (stats.totalRevenue || 1)) * 300)}%` }}
                         ></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10">
        {/* Top Products */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Market Leaders</h2>
            <div className="w-8 h-px bg-slate-100" />
          </div>
          <div className="space-y-8">
            {stats?.topProducts?.map((product, i) => (
              <div key={i} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-black group-hover:text-white transition-all duration-300">
                    0{i+1}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-[200px]">{product.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Premium Collection</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black uppercase tracking-widest text-indigo-600">{product.totalSold} Sold</p>
                  <p className="text-[9px] text-slate-300 font-medium">Growth +12%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Criticality */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-sm font-black uppercase tracking-[0.2em] text-rose-500">Stock Criticality</h2>
             <TfiAlert className="text-rose-500 text-lg animate-pulse" />
          </div>
          <div className="space-y-6">
            {stats?.lowStockProducts?.map((product, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-rose-50/50 rounded-3xl border border-rose-100 group hover:bg-rose-50 transition-colors">
                <div>
                   <p className="text-xs font-black text-rose-900 uppercase tracking-tight">{product.name}</p>
                   <p className="text-[9px] text-rose-400 font-bold uppercase tracking-[0.2em] mt-1.5">Action Required</p>
                </div>
                <Link href={`/admin/products/${product._id}/edit`} className="px-5 py-2 bg-white border border-rose-200 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">Restock</Link>
              </div>
            ))}
            {(!stats?.lowStockProducts || stats.lowStockProducts.length === 0) && (
              <div className="text-center py-20">
                 <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TfiPackage className="text-2xl" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">All inventory levels optimized</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
