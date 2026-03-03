import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request, context) {
  try {
    const user = await getUserFromRequest();
    
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await context.params;
    const order = await Order.findById(id).populate("orderItems.product");

    if (!order) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    // Security check: Only the owner can see the order
    if (order.userId !== user.id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    return Response.json(order);
  } catch (error) {
    return Response.json({ message: "Error fetching order", error: error.message }, { status: 500 });
  }
}

// For Order Cancellation
export async function PUT(request, context) {
  try {
    const user = await getUserFromRequest();
    
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await context.params;
    const { status } = await request.json(); // Usually "Cancelled"

    const order = await Order.findById(id);

    if (!order) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.userId !== user.id) {
       return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (order.status === "Delivered") {
      return Response.json({ message: "Cannot cancel a delivered order" }, { status: 400 });
    }

    order.status = status || "Cancelled";
    const updatedOrder = await order.save();

    return Response.json(updatedOrder);
  } catch (error) {
    return Response.json({ message: "Error updating order", error: error.message }, { status: 500 });
  }
}
