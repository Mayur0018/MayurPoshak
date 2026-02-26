import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import supabase from "@/lib/supabaseClient";

export async function GET(request) {
  try {
    await connectDB();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 });
    return Response.json(orders);
  } catch (error) {
    return Response.json({ message: "Error fetching orders", error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = await request.json();

    if (!orderItems || orderItems.length === 0) {
      return Response.json({ message: "No order items" }, { status: 400 });
    }

    const order = new Order({
      userId: user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    return Response.json(createdOrder, { status: 201 });
  } catch (error) {
    return Response.json({ message: "Error creating order", error: error.message }, { status: 500 });
  }
}
