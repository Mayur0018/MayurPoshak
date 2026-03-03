import Stripe from 'stripe';
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return Response.json({ message: "Session ID required" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const userId = session.metadata?.userId;
      const items = JSON.parse(session.metadata?.items || "[]");
      const shippingAddress = {
        address: session.metadata?.address || "",
        city: session.metadata?.city || "",
        pincode: session.metadata?.pincode || "",
        phone: session.metadata?.phone || "",
      };

      await connectDB();

      // Check if order already exists
      const existingOrder = await Order.findOne({ "paymentResult.id": session.payment_intent });
      if (existingOrder) {
        return Response.json({ message: "Order already exists", order: existingOrder }, { status: 200 });
      }

      const Product = (await import("@/models/Product")).default;

      // Fetch full product details
      const orderItems = await Promise.all(
        items.map(async (item) => {
          const dbProduct = await Product.findById(item.id);
          if (dbProduct) {
            // Reduce stock
            await Product.findByIdAndUpdate(item.id, {
              $inc: { stock: -item.qty }
            });
          }

          return {
            name: dbProduct?.name || "Unknown Product",
            quantity: Number(item.qty) || 1,
            image: dbProduct?.image || "/placeholder.png",
            price: Number(dbProduct?.price) || 0,
            product: item.id,
            size: item.size
          };
        })
      );
      
      const order = new Order({
        userId,
        orderItems,
        shippingAddress,
        itemsPrice: (Number(session.amount_subtotal) || 0) / 100,
        shippingPrice: (Number(session.total_details?.amount_shipping) || 0) / 100,
        totalPrice: (Number(session.amount_total) || 0) / 100,
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
      return Response.json({ message: "Order created successfully", order }, { status: 201 });
    } else {
      return Response.json({ message: "Payment not completed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying order:", error);
    return Response.json({ message: "Internal server error", error: error.message, stack: error.stack }, { status: 500 });
  }
}
