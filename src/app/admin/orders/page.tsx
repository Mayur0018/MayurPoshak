import { getServerSupabase } from "@/lib/supabaseServer";
import { updateOrderStatus } from "@/actions/orders";

export default async function AdminOrders() {
  const supabase = await getServerSupabase();
  const { data: orders } = await supabase
    .from("orders")
    .select("id,status,total_amount,created_at,user_id")
    .order("created_at", { ascending: false })
    .limit(50);

  async function changeStatus(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    const status = String(formData.get("status"));
    await updateOrderStatus(id, status);
  }

  const statuses = ["pending","confirmed","paid","shipped","delivered","cancelled"];

  return (
    <div className="bg-white border rounded p-4">
      <h2 className="text-lg font-semibold mb-3">Orders</h2>
      <div className="divide-y">
        {(orders ?? []).map((o: any) => (
          <div key={o.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">Order #{o.id}</div>
              <div className="text-xs text-gray-500">
                ₹{Number(o.total_amount ?? 0).toFixed(2)} • {new Date(o.created_at).toLocaleString()}
              </div>
              <div className="text-xs">User: {o.user_id ?? "—"}</div>
            </div>
            <form action={changeStatus} className="flex items-center gap-2">
              <input type="hidden" name="id" value={o.id} />
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
