import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123456";

// Block/Unblock User
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { isBlocked } = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "admin") return Response.json({ message: "Forbidden" }, { status: 403 });

    await connectDB();
    const user = await User.findByIdAndUpdate(id, { isBlocked }, { new: true });

    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    return Response.json(user, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Error updating user" }, { status: 500 });
  }
}

// Delete User
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "admin") return Response.json({ message: "Forbidden" }, { status: 403 });

    await connectDB();
    const user = await User.findByIdAndDelete(id);

    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    return Response.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Error deleting user" }, { status: 500 });
  }
}
