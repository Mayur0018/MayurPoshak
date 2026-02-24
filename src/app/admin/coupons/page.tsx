import { getServerSupabase } from "@/lib/supabaseServer";
import { createCoupon, toggleCouponActive } from "@/actions/adminCoupons";

export default async function AdminCoupons() {
  const supabase = await getServerSupabase();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("id,code,discount_type,discount_value,min_order_value,is_active,expiry_date,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  async function submitCreate(formData: FormData) {
    "use server";
    const payload = {
      code: String(formData.get("code") ?? ""),
      discount_type: String(formData.get("discount_type")) as "percentage" | "fixed",
      discount_value: Number(formData.get("discount_value") ?? 0),
      min_order_value: Number(formData.get("min_order_value") ?? 0),
      expiry_date: String(formData.get("expiry_date") ?? "") || undefined,
      is_active: String(formData.get("is_active")) === "on",
    };
    await createCoupon(payload);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded bg-white p-4 border">
        <h2 className="text-lg font-semibold">Create Coupon</h2>
        <form action={submitCreate} className="grid grid-cols-2 gap-3 mt-3">
          <input name="code" placeholder="Code" className="border p-2 col-span-2" />
          <select name="discount_type" className="border p-2 col-span-1">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
          <input name="discount_value" type="number" step="0.01" placeholder="Value" className="border p-2 col-span-1" />
          <input name="min_order_value" type="number" step="0.01" placeholder="Min order value" className="border p-2 col-span-2" />
          <input name="expiry_date" type="date" className="border p-2 col-span-1" />
          <label className="flex items-center gap-2"><input type="checkbox" name="is_active" defaultChecked />Active</label>
          <button className="bg-black text-white px-4 py-2 col-span-2">Create</button>
        </form>
      </div>
      <div className="rounded bg-white p-4 border">
        <h2 className="text-lg font-semibold">Coupons</h2>
        <div className="divide-y mt-3">
          {(coupons ?? []).map((c: any) => (
            <div key={c.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{c.code}</div>
                <div className="text-xs text-gray-500">{c.discount_type} • {c.discount_value} • Min ₹{Number(c.min_order_value).toFixed(2)}</div>
                <div className="text-xs">Active: {c.is_active ? "Yes" : "No"} • Expires: {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : "—"}</div>
              </div>
              <form action={async () => { "use server"; await toggleCouponActive(c.id, !c.is_active); }}>
                <button className="border px-3 py-1 text-sm">{c.is_active ? "Deactivate" : "Activate"}</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
