import { connectDB } from "@/lib/mongodb";
import Address from "@/models/Address";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ message: "Invalid token" }, { status: 401 });

    await connectDB();
    const addresses = await Address.find({ user: decoded.id }).sort({ isDefault: -1, createdAt: -1 });
    return Response.json(addresses);
  } catch (error) {
    return Response.json({ message: "Error fetching addresses", error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ message: "Invalid token" }, { status: 401 });

    const data = await request.json();
    await connectDB();

    // If making default, unset others
    if (data.isDefault) {
      await Address.updateMany({ user: decoded.id }, { isDefault: false });
    }

    const address = await Address.create({ ...data, user: decoded.id });
    
    // Update user's addresses array
    await User.findByIdAndUpdate(decoded.id, { $push: { addresses: address._id } });

    return Response.json(address, { status: 201 });
  } catch (error) {
    return Response.json({ message: "Error creating address", error: error.message }, { status: 500 });
  }
}
