import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123456";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "admin") return Response.json({ message: "Forbidden" }, { status: 403 });

    await connectDB();
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 });

    return Response.json(users, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Error fetching users" }, { status: 500 });
  }
}
