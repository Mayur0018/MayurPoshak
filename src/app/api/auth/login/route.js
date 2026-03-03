import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { generateToken, getCookieOptions } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ message: "Please provide email and password" }, { status: 400 });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (user.isBlocked) {
      return Response.json({ message: "Account is blocked. Please contact support." }, { status: 403 });
    }

    // Generate token and set cookie
    const token = generateToken(user);
    const cookieStore = await cookies();
    
    cookieStore.set("token", token, getCookieOptions());

    return Response.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ message: "Error in login", error: error.message }, { status: 500 });
  }
}
