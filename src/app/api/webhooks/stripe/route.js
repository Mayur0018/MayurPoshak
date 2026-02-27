import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return Response.json({ message: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // Extract metadata and other info
    const userId = session.metadata?.userId;
    const items = JSON.parse(session.metadata?.items || "[]");
    const shippingAddress = {
      address: session.metadata?.address || "",
      city: session.metadata?.city || "",
      pincode: session.metadata?.pincode || "",
      phone: session.metadata?.phone || "",
    };

    try {
      await connectDB();
      
      const order = new Order({
        userId,
        orderItems: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress,
        itemsPrice: session.amount_subtotal / 100,
        shippingPrice: (session.total_details?.amount_shipping || 0) / 100,
        totalPrice: session.amount_total / 100,
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          id: session.payment_intent,
          status: "succeeded",
          update_time: new Date().toISOString(),
          email_address: session.customer_details?.email,
        },
        status: "Processing",
      });

      await order.save();
      console.log("Order saved successfully:", order._id);
    } catch (error) {
      console.error("Error saving order from webhook:", error);
      return Response.json({ message: "Error saving order" }, { status: 500 });
    }
  }

  return Response.json({ received: true });
}
