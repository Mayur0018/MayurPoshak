import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123456";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) return Response.json([]);

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "admin") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const searchRegex = new RegExp(query, "i");

    const [products, orders, users] = await Promise.all([
      Product.find({ 
        $or: [
          { name: searchRegex },
          { sku: searchRegex }
        ]
      }).limit(5),
      Order.find({ 
        $or: [
          { _id: query.length === 24 ? query : null },
          { "shippingAddress.phone": searchRegex }
        ]
      }).limit(5),
      User.find({ 
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      }).limit(5)
    ]);

    // Format results for the UI
    const results = [
      ...products.map(p => ({ id: p._id, type: "Product", label: p.name, href: `/admin/products/${p._id}/edit` })),
      ...orders.filter(o => o).map(o => ({ id: o._id, type: "Order", label: `Order #${o._id.toString().slice(-6)}`, href: `/admin/orders/${o._id}` })),
      ...users.map(u => ({ id: u._id, type: "User", label: u.name || u.email, href: `/admin/users/${u._id}` }))
    ];

    return Response.json(results);
  } catch (error) {
    console.error("Admin search error:", error);
    return Response.json({ message: "Search failed" }, { status: 500 });
  }
}
