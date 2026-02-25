"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function init() {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;
      if (error || !data?.user) {
        router.push("/Signin");
        return;
      }
      setUser(data.user);
      const uid = data.user.id;
      const [{ data: ords }, { data: addrs }] = await Promise.all([
        supabase.from("orders").select("id,total_amount,status,created_at").eq("user_id", uid).order("created_at", { ascending: false }),
        supabase.from("addresses").select("*").eq("user_id", uid).order("is_default", { ascending: false }),
      ]);
      setOrders(ords ?? []);
      setAddresses(addrs ?? []);
      setLoading(false);
    }
    init();
    return () => { mounted = false; };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/Signin");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  const avatar = user.user_metadata?.avatar_url || "https://pagedone.io/asset/uploads/1705471668.png";
  const fullName = user.user_metadata?.full_name || user.email;

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="relative h-40 bg-gradient-to-r from-indigo-600 to-purple-600" />
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <img src={avatar} alt="user" className="w-20 h-20 rounded-full border-4 border-white -mt-10 object-cover" />
            <div className="-mt-6">
              <div className="text-xl font-semibold">{fullName}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
            <div className="ml-auto flex gap-3">
              <button
                onClick={handleLogout}
                className="text-sm px-5 py-2 bg-red-50 text-red-600 font-bold rounded-lg border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
              >
                Logout Account
              </button>
            </div>
          </div>

          <div className="mt-6 border-b flex gap-6 text-sm">
            {["overview","orders","addresses","settings"].map((t) => (
              <button
                key={t}
                className={`pb-2 ${tab === t ? "border-b-2 border-indigo-600 text-indigo-700" : "text-gray-600"}`}
                onClick={() => setTab(t)}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded p-4">
                  <div className="text-sm text-gray-600">Orders</div>
                  <div className="text-2xl font-semibold">{orders.length}</div>
                </div>
                <div className="border rounded p-4">
                  <div className="text-sm text-gray-600">Addresses</div>
                  <div className="text-2xl font-semibold">{addresses.length}</div>
                </div>
                <div className="border rounded p-4">
                  <div className="text-sm text-gray-600">Member since</div>
                  <div className="text-2xl font-semibold">{new Date(user.created_at || Date.now()).toLocaleDateString()}</div>
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div className="space-y-3">
                {loading ? (
                  <div className="text-sm text-gray-600">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-sm text-gray-600">No orders yet</div>
                ) : (
                  orders.map((o) => (
                    <div key={o.id} className="border rounded p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">Order #{o.id}</div>
                        <div className="text-xs text-gray-600">{new Date(o.created_at).toLocaleString()}</div>
                      </div>
                      <div className="text-sm">₹{Number(o.total_amount ?? 0).toFixed(2)}</div>
                      <div className="text-xs px-2 py-1 rounded bg-gray-100">{o.status}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "addresses" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {loading ? (
                  <div className="text-sm text-gray-600">Loading addresses...</div>
                ) : addresses.length === 0 ? (
                  <div className="text-sm text-gray-600">No saved addresses</div>
                ) : (
                  addresses.map((a) => (
                    <div key={a.id} className="border rounded p-3">
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-gray-600">{a.line1}{a.line2 ? `, ${a.line2}` : ""}</div>
                      <div className="text-xs">{a.city}, {a.state} {a.postal_code}</div>
                      <div className="text-xs">{a.country}</div>
                      {a.is_default && <div className="text-xs text-green-700 mt-1">Default</div>}
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "settings" && (
              <div className="space-y-3">
                <div className="border rounded p-4">
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="text-sm">{user.email}</div>
                </div>
                <div className="text-sm text-gray-600">For account changes, contact support.</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Link href="/" className="text-sm underline">Back to Home</Link>
        </div>
      </div>
    </section>
  );
}
