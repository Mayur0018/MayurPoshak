import Stripe from 'stripe';
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      console.error("Missing STRIPE_SECRET_KEY");
      return Response.json({ error: "Checkout configuration missing" }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecret);

    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { cartItems, shippingDetails, couponId } = body;

    if (!cartItems || cartItems.length === 0) {
      return Response.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Prepare line items
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name || "Product",
          images: item.image ? [item.image] : [],
          description: (item.size || item.selectedSize) ? `Size: ${item.size || item.selectedSize}` : "",
        },
        unit_amount: Math.round((Number(item.price) || 0) * 100),
      },
      quantity: Number(item.quantity) || 1,
    }));

    // Store product IDs and metadata
    const simplifiedItems = cartItems.map(item => ({
      id: item._id || item.id,
      qty: item.quantity,
      size: item.size || item.selectedSize
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      invoice_creation: { enabled: true },
      line_items: lineItems,
      metadata: {
        userId: user.id,
        items: JSON.stringify(simplifiedItems).substring(0, 500),
        address: (shippingDetails?.address || "").substring(0, 200),
        city: (shippingDetails?.city || "").substring(0, 100),
        pincode: (shippingDetails?.pincode || "").substring(0, 20),
        phone: (shippingDetails?.phone || "").substring(0, 20),
        couponId: couponId || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout`,
    });

    return Response.json({ id: session.id });
  } catch (error) {
    console.error("Checkout API error:", error);
    return Response.json(
      { error: error.message || "An unexpected error occurred during checkout" },
      { status: 500 }
    );
  }
}
