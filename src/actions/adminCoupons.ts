"use server";
import { getServiceSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function createCoupon(input: {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value?: number;
  expiry_date?: string;
  is_active?: boolean;
}) {
  const supabase = getServiceSupabase();
  const upperCode = input.code.trim().toUpperCase();
  
  const { data: dup } = await supabase.from("coupons").select("id").eq("code", upperCode).maybeSingle();
  if (dup) return { ok: false, reason: "duplicate" };
  
  const { error } = await supabase.from("coupons").insert({
    code: upperCode,
    discount_type: input.discount_type,
    discount_value: input.discount_value,
    min_order_value: input.min_order_value ?? 0,
    expiry_date: input.expiry_date ?? null,
    is_active: input.is_active ?? true,
  });
  
  if (error) {
    console.error("Error creating coupon:", error);
    return { ok: false };
  }
  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function toggleCouponActive(id: number, is_active: boolean) {
  const supabase = getServiceSupabase();
  const { error } = await supabase.from("coupons").update({ is_active }).eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/coupons");
  return { ok: true };
}
