"use server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabaseServer";

const CouponSchema = z.object({
  code: z.string().min(2),
  amount: z.number().nonnegative(),
});

export async function validateCoupon(input: unknown) {
  const parsed = CouponSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const supabase = await getServerSupabase();
  const now = new Date().toISOString();
  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", parsed.data.code)
    .eq("is_active", true)
    .or(`expiry_date.is.null,expiry_date.gt.${now}`)
    .maybeSingle();
  if (!coupon) return { ok: false };
  if (Number(coupon.min_order_value ?? 0) > parsed.data.amount) return { ok: false };
  const discount =
    coupon.discount_type === "percentage"
      ? (parsed.data.amount * Number(coupon.discount_value)) / 100
      : Number(coupon.discount_value);
  const total = Math.max(0, parsed.data.amount - discount);
  return { ok: true, total, discount };
}
