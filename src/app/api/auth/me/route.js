import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isBlocked) {
      return Response.json({ message: "User is blocked" }, { status: 403 });
    }

    return Response.json(user, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
