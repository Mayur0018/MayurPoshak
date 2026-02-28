import { getServiceSupabase } from "@/lib/supabaseServer";

export async function POST(request) {
  try {
    const { code, amount } = await request.json();
    if (!code) {
      return Response.json({ message: "Coupon code is required" }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const upperCode = code.trim().toUpperCase();

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", upperCode)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("Supabase error during coupon validation:", error);
      return Response.json({ message: "Internal server error" }, { status: 500 });
    }

    if (!coupon) {
      return Response.json({ message: "Invalid or inactive coupon code" }, { status: 404 });
    }

    // Check expiry
    if (coupon.expiry_date) {
      const expiryDate = new Date(coupon.expiry_date);
      const now = new Date();
      if (expiryDate < now) {
        return Response.json({ message: "Coupon has expired" }, { status: 400 });
      }
    }

    // Check min order value
    if (coupon.min_order_value && amount < coupon.min_order_value) {
      return Response.json({ 
        message: `Minimal order value of ₹${coupon.min_order_value} required for this coupon` 
      }, { status: 400 });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === "percentage") {
      discount = (amount * coupon.discount_value) / 100;
    } else {
      discount = coupon.discount_value;
    }

    return Response.json({
      valid: true,
      couponId: coupon.id,
      discount: Math.round(discount),
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value
    });

  } catch (error) {
    console.error("Coupon validation error:", error);
    return Response.json({ message: "Error validating coupon" }, { status: 500 });
  }
}
