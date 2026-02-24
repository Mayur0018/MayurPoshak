import crypto from "crypto";
import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, address } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = hmac.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    const total_amount = cart?.reduce((sum, item) => {
      const qty = item.quantity ?? 1;
      return sum + qty * Number(item.price ?? 0);
    }, 0) ?? 0;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        external_order_id: razorpay_order_id,
        external_payment_id: razorpay_payment_id,
        status: "paid",
        total_amount,
        address_id: address?.id ?? null,
      })
      .select()
      .single();

    if (orderErr) {
      return NextResponse.json({ error: orderErr.message }, { status: 500 });
    }

    if (Array.isArray(cart) && cart.length) {
      const items = cart.map((i) => ({
        order_id: order.id,
        product_id: i.product_id,
        variant_id: i.variant_id ?? null,
        quantity: i.quantity ?? 1,
        price: Number(i.price ?? 0),
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(items);
      if (itemsErr) {
        return NextResponse.json({ error: itemsErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, order_id: order.id });
  } catch (e) {
    return NextResponse.json({ error: e.message ?? "Verification failed" }, { status: 500 });
  }
}

