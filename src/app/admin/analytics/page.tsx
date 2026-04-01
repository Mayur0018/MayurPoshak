import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

function aggregateMonthly(orders: any[]) {
  const map = new Map<string, number>();
  for (const o of orders) {
    if (o.status === "Cancelled") continue;
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) ?? 0) + Number(o.totalPrice ?? 0));
  }
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export default async function AdminAnalytics() {
  await connectDB();
  const [orders, products] = await Promise.all([
    // @ts-ignore
    Order.find().sort({ createdAt: 1 }).lean(),
    // @ts-ignore
    Product.find().lean()
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
