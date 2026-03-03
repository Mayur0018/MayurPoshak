"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";
import { 
  TfiPackage, 
  TfiLocationPin, 
  TfiSettings, 
  TfiUser, 
  TfiPowerOff,
  TfiHeadphoneAlt,
  TfiAngleRight
} from "react-icons/tfi";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const res = await fetch("/api/auth/me");
        if (!mounted) return;
        
        if (!res.ok) {
          router.push("/Signin");
          return;
        }

        const userData = await res.json();
        setUser(userData);

        // Fetch orders from existing API
        const ordsRes = await fetch("/api/orders").then(res => res.json());
        if (mounted) {
          setOrders(Array.isArray(ordsRes) ? ordsRes : []);
          
          // Legacy: Fetch addresses from Supabase if still available
          const { data: addrs } = await supabase.from("addresses").select("*").eq("user_id", userData._id).order("is_default", { ascending: false });
          setAddresses(addrs ?? []);
          
          setLoading(false);
        }
      } catch (err) {
        if (mounted) router.push("/Signin");
      }
    }
    init();
    return () => { mounted = false; };
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      try { await supabase.auth.signOut(); } catch (e) {} // Compatibility
      window.localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
      window.location.href = "/";
    }
  };

  if (isLoggingOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
        <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Signing you out...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  const avatar = `https://ui-avatars.com/api/?name=${user.name || user.email}&background=000&color=fff`;
  const fullName = user.name || user.email.split('@')[0];

  const MenuItems = [
    { id: "overview", label: "Dashboard", icon: TfiUser },
    { id: "orders", label: "Order History", icon: TfiPackage },
    { id: "addresses", label: "Saved Addresses", icon: TfiLocationPin },
    { id: "settings", label: "Account Settings", icon: TfiSettings },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24">
      {/* Premium Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold mb-4">Your Private Boutique</p>
          <h1 className="text-3xl md:text-5xl font-extralight tracking-tight text-gray-900 uppercase">Bonjour, {fullName}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-12">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 flex flex-col gap-2">
            {MenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  tab === item.id 
                    ? "bg-black text-white shadow-xl" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="text-lg" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                </div>
                <TfiAngleRight className={`text-[10px] transition-transform duration-300 ${tab === item.id ? "rotate-90" : "group-hover:translate-x-1"}`} />
              </button>
            ))}
            
            <div className="h-px bg-gray-50 my-2" />
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
            >
              <TfiPowerOff className="text-lg" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Sign Out</span>
            </button>
          </div>

          <div className="mt-6 bg-black rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10 text-center">
                <TfiHeadphoneAlt className="text-3xl mx-auto mb-4" />
                <p className="text-[10px] uppercase tracking-widest font-bold mb-2">Need help?</p>
                <p className="text-[11px] text-gray-400 mb-4 font-light">Contact our concierge for any assistance.</p>
                <button className="w-full py-3 bg-white text-black text-[10px] font-black tracking-widest rounded-xl hover:scale-95 transition">SUPPORT</button>
             </div>
             <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-50 min-h-[500px]">
             {tab === "overview" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-8 mb-12 border-b border-gray-50 pb-12">
                     <div className="relative">
                        <img src={avatar} className="w-24 h-24 rounded-full object-cover border-4 border-[#fafafa]" alt="avatar" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-black rounded-full border-4 border-white flex items-center justify-center">
                           <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        </div>
                     </div>
                     <div>
                        <h2 className="text-2xl font-light text-gray-900 uppercase tracking-widest">{fullName}</h2>
                        <p className="text-xs text-gray-400 mt-1 font-medium">{user.email}</p>
                        <div className="mt-4 inline-block px-3 py-1 bg-gray-100 rounded-full text-[9px] font-bold text-gray-500 uppercase tracking-widest">Premium Member</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "Total Orders", value: orders.length, icon: TfiPackage },
                      { label: "Saved Points", value: "250", icon: TfiUser },
                      { label: "Concierge Status", value: "Gold", icon: TfiSettings }
                    ].map((stat, i) => (
                      <div key={i} className="p-8 bg-[#fafafa] rounded-3xl border border-gray-50 group hover:bg-black transition-all duration-500">
                        <stat.icon className="text-2xl mb-6 text-gray-400 group-hover:text-white transition-colors" />
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{stat.label}</p>
                        <p className="text-3xl font-extralight text-gray-900 group-hover:text-white transition-colors tracking-tighter">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                   <div className="mt-12">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Recent Activity</h3>
                      {orders.slice(0, 1).map((order) => (
                        <Link 
                          key={order._id || Math.random()} 
                          href={`/orders/${order._id}`}
                          className="flex items-center justify-between p-6 border border-gray-100 rounded-2xl hover:border-black transition-all group block shadow-sm hover:shadow-md"
                        >
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-black transition-colors">
                                 <TfiPackage className="text-gray-900 group-hover:text-white transition-colors" />
                              </div>
                              <div>
                                 <p className="text-xs font-bold uppercase tracking-widest">Order #{order._id?.slice(-6) || 'N/A'}</p>
                                 <p className="text-[10px] text-gray-400 mt-0.5">{new Date(order.createdAt || order.created_at).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                             <p className="text-xs font-black tracking-widest uppercase text-indigo-600">{order.status}</p>
                             <TfiAngleRight className="text-[10px] text-gray-300 group-hover:translate-x-1 transition-transform" />
                           </div>
                        </Link>
                      ))}
                   </div>
                </div>
             )}

             {tab === "orders" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-10">Purchase History</h2>
                   <div className="space-y-4">
                      {orders.length > 0 ? orders.map((order) => (
                        <div key={order._id} className="group p-6 rounded-[2rem] border border-gray-100 hover:border-black transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-2xl hover:translate-y-[-4px] bg-white">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-20 bg-gray-50 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-gray-100">
                                 <img src={order.orderItems?.[0]?.image || "/mayurposhak.png"} className="w-full h-full object-cover" alt="product" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">REFERENCE #{order._id?.slice(-8).toUpperCase() || 'N/A'}</p>
                                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                                 <div className="flex items-center gap-2 mt-2">
                                    <span className={`w-2 h-2 rounded-full ${order.isPaid ? 'bg-green-400' : 'bg-yellow-400'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{order.status}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center justify-between md:flex-col md:items-end gap-2 pr-4">
                              <p className="text-2xl font-extralight tracking-tighter">₹{Number(order.totalPrice).toLocaleString('en-IN')}</p>
                              <Link href={`/orders/${order._id}`} className="text-[10px] font-black uppercase tracking-widest text-black underline underline-offset-4 hover:text-gray-400 transition">View Details</Link>
                           </div>
                        </div>
                      )) : (
                        <div className="text-center py-20 bg-[#fafafa] rounded-[2rem] border-2 border-dashed border-gray-100">
                           <TfiPackage className="text-4xl mx-auto mb-4 text-gray-200" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No treasures found yet.</p>
                        </div>
                      )}
                   </div>
                </div>
             )}

             {tab === "addresses" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center justify-between mb-10">
                      <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Saved Addresses</h2>
                      <button className="px-6 py-2 bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full hover:scale-95 transition">Add New</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.length > 0 ? addresses.map((addr) => (
                        <div key={addr.id} className="relative p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                           {addr.is_default && (
                             <div className="absolute top-6 right-8 px-3 py-1 bg-black text-white text-[8px] font-black uppercase tracking-widest rounded-full">Default</div>
                           )}
                           <TfiLocationPin className="text-2xl mb-6 text-gray-300 group-hover:text-black transition-colors" />
                           <h4 className="text-xs font-bold uppercase tracking-widest mb-3">{addr.name || 'Resident'}</h4>
                           <div className="text-[11px] text-gray-500 space-y-1 font-medium leading-relaxed">
                              <p>{addr.line1}</p>
                              {addr.line2 && <p>{addr.line2}</p>}
                              <p className="text-black">{addr.city}, {addr.state} - {addr.postal_code}</p>
                              <p className="uppercase tracking-widest text-[9px] mt-2 block">{addr.country}</p>
                           </div>
                           <div className="mt-8 flex gap-4 pt-6 border-t border-gray-50">
                              <button className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition">Edit</button>
                              <button className="text-[9px] font-black uppercase tracking-widest text-red-300 hover:text-red-600 transition">Remove</button>
                           </div>
                        </div>
                      )) : (
                        <div className="col-span-full text-center py-20 bg-[#fafafa] rounded-[2rem] border-2 border-dashed border-gray-100">
                           <TfiLocationPin className="text-4xl mx-auto mb-4 text-gray-200" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Specify your delivery locations.</p>
                        </div>
                      )}
                   </div>
                </div>
             )}

             {tab === "settings" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-10">Account Settings</h2>
                   <div className="max-w-xl space-y-10">
                      <div>
                         <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-4">Contact Information</label>
                         <div className="space-y-4">
                            <div className="p-5 bg-[#fafafa] rounded-2xl flex items-center justify-between border border-gray-50">
                               <div>
                                  <p className="text-[9px] font-bold uppercase text-gray-400 mb-1">Email Address</p>
                                  <p className="text-sm font-medium">{user.email}</p>
                               </div>
                               <button className="text-[10px] font-black uppercase text-indigo-600">Modify</button>
                            </div>
                         </div>
                      </div>

                      <div>
                         <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-4">Security</label>
                         <button className="w-full text-left p-5 bg-[#fafafa] rounded-2xl flex items-center justify-between border border-gray-50 group hover:border-black transition">
                            <span className="text-sm font-medium uppercase tracking-widest">Update Password</span>
                            <TfiAngleRight className="text-xs text-gray-300 group-hover:translate-x-1 transition" />
                         </button>
                      </div>

                      <div className="pt-10">
                         <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition">Request Account Deletion</button>
                         <p className="text-[10px] text-gray-400 mt-4 leading-relaxed font-light">
                           Closing your account is permanent. All orders, points, and saved addresses will be discarded.
                         </p>
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
