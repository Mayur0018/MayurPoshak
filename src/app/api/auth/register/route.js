import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { generateToken, getCookieOptions } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ message: "Please provide name, email, and password" }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }

    // Create user with welcome points
    const user = await User.create({
      name,
      email,
      password,
      phone,
      points: 100, // Reward for joining Mayur Poshak
    });

    if (user) {
      const token = generateToken(user);
      const cookieStore = await cookies();
      
      cookieStore.set("token", token, getCookieOptions());

      return Response.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }, { status: 201 });
    } else {
      return Response.json({ message: "Invalid user data" }, { status: 400 });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ message: "Error in registration", error: error.message }, { status: 500 });
  }
}
