import { getServerSupabase } from "@/lib/supabaseServer";

function aggregateMonthly(orders: any[]) {
  const map = new Map<string, number>();
  for (const o of orders) {
    if (o.status !== "paid" && o.status !== "delivered" && o.status !== "shipped" && o.status !== "confirmed") continue;
    const d = new Date(o.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) ?? 0) + Number(o.total_amount ?? 0));
  }
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export default async function AdminAnalytics() {
  const supabase = await getServerSupabase();
  const [{ data: orders }, { data: products }] = await Promise.all([
    supabase.from("orders").select("id,total_amount,status,created_at").order("created_at", { ascending: true }),
    supabase.from("products").select("id,name,category_id,base_price,discount_percentage"),
  ]);
  const monthly = aggregateMonthly(orders ?? []);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white border rounded p-4">
        <h2 className="text-lg font-semibold mb-3">Monthly Revenue</h2>
        <div className="flex items-end gap-2 h-40">
          {monthly.map(([key, value]) => {
            const height = Math.min(160, Math.max(8, Math.round(Number(value) / 100)));
            return (
              <div key={key} className="flex flex-col items-center">
                <div className="bg-indigo-500 w-6" style={{ height }} />
                <div className="text-xs mt-1">{key}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white border rounded p-4">
        <h2 className="text-lg font-semibold mb-3">Top Selling Products</h2>
        <div className="text-sm text-gray-600">Hook up to order_items aggregation for exact rankings.</div>
      </div>
    </div>
  );
}
