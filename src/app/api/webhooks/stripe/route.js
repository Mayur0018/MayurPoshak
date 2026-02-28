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
      const Product = (await import("@/models/Product")).default;

      // Fetch full product details from DB because Stripe metadata has limited space
      const orderItems = await Promise.all(
        items.map(async (item) => {
          const dbProduct = await Product.findById(item.id);
          if (!dbProduct) {
            console.error(`Product not found in DB: ${item.id}`);
            return {
              name: "Unknown Product",
              quantity: item.qty,
              image: "/placeholder.png",
              price: 0,
              product: item.id,
              size: item.size
            };
          }

          // Reduce stock
          await Product.findByIdAndUpdate(item.id, {
            $inc: { stock: -item.qty }
          });

          return {
            name: dbProduct.name,
            quantity: item.qty,
            image: dbProduct.image,
            price: dbProduct.price,
            product: item.id,
            size: item.size
          };
        })
      );
      
      const order = new Order({
        userId,
        orderItems,
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
      console.log("Order saved successfully and stock updated:", order._id);
    } catch (error) {
      console.error("Error processing order in webhook:", error);
      return Response.json({ message: "Error saving order" }, { status: 500 });
    }
  }

  return Response.json({ received: true });
}
