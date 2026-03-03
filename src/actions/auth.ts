"use server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123456";

/**
 * Verifies if the current user is an authenticated admin on the server.
 * Throws an error if validation fails.
 */
export async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized: Please log in.");
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== 'admin') {
      console.error("UNAUTHORIZED_ACCESS_ATTEMPT: User lacks admin role.");
      throw new Error("Unauthorized: Professional access only.");
    }

    return payload;
  } catch (error) {
    throw new Error("Unauthorized: Invalid session.");
  }
}

/**
 * Promotes a user to admin manually (Use only for initial setup or local debugging)
 */
export async function makeAdmin(mongoId: string, email: string) {
  await connectDB();
  
  const user = await User.findByIdAndUpdate(mongoId, { role: "admin" }, { new: true });
    
  if (!user) throw new Error("User update failed: User not found in MongoDB.");

  return { success: true };
}
