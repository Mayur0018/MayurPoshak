import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { updateOrderStatus } from "@/actions/orders";

export default async function AdminOrders() {
  await connectDB();
  // @ts-ignore
  const orders = await Order.find().sort({ createdAt: -1 }).limit(50).lean();

  async function changeStatus(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    const status = String(formData.get("status"));
    await updateOrderStatus(id, status);
  }

  const statuses = ["Pending", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

  return (
    <div className="bg-white border rounded p-4">
      <h2 className="text-lg font-semibold mb-3">Orders</h2>
      <div className="divide-y">
        {(orders ?? []).map((o: any) => (
          <div key={o._id.toString()} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">Order #{o._id.toString()}</div>
              <div className="text-xs text-gray-500">
                ₹{Number(o.totalPrice ?? 0).toFixed(2)} • {new Date(o.createdAt).toLocaleString()}
              </div>
              <div className="text-xs">User: {o.userId ?? "—"}</div>
            </div>
            <form action={changeStatus} className="flex items-center gap-2">
              <input type="hidden" name="id" value={o._id.toString()} />
              <select name="status" defaultValue={o.status} className="border px-2 py-1 text-sm">
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="border px-3 py-1 text-sm">Update</button>
            </form>
          </div>
        ))}
        {(orders ?? []).length === 0 && <div className="py-10 text-center text-sm text-gray-600">No orders</div>}
      </div>
    </div>
  );
}
