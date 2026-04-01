import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ message: "Invalid session" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return Response.json({ message: "Provide both current and new passwords" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(decoded.id).select("+password");

    if (!user) {
      return Response.json({ message: "User account not found" }, { status: 404 });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return Response.json({ message: "Current password is incorrect" }, { status: 401 });
    }

    // Set new password (it will be hashed by the pre-save hook)
    user.password = newPassword;
    await user.save();

    return Response.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Update password error:", error);
    return Response.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
