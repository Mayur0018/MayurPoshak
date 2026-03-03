import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123456";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "admin") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    // Parallel counts and aggregations
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      revenueData,
      recentOrders
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5)
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Monthly revenue aggregation
    const monthlyRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    return Response.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      monthlyRevenue
    }, { status: 200 });
  } catch (error) {
    console.error("Admin stats error:", error);
    return Response.json({ message: "Error fetching stats", error: error.message }, { status: 500 });
  }
}
