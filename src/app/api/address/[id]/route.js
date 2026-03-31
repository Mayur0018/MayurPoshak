import { connectDB } from "@/lib/mongodb";
import Address from "@/models/Address";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ message: "Invalid token" }, { status: 401 });

    const data = await request.json();
    await connectDB();

    const address = await Address.findOne({ _id: id, user: decoded.id });
    if (!address) return Response.json({ message: "Address not found" }, { status: 404 });

    if (data.isDefault) {
      await Address.updateMany({ user: decoded.id }, { isDefault: false });
    }

    const updatedAddress = await Address.findByIdAndUpdate(id, data, { new: true });
    return Response.json(updatedAddress);
  } catch (error) {
    return Response.json({ message: "Error updating address", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ message: "Invalid token" }, { status: 401 });

    await connectDB();
    const address = await Address.findOneAndDelete({ _id: id, user: decoded.id });
    if (!address) return Response.json({ message: "Address not found" }, { status: 404 });

    // Remove from user
    await User.findByIdAndUpdate(decoded.id, { $pull: { addresses: id } });

    // If deleted was default, make another one default
    if (address.isDefault) {
      const another = await Address.findOne({ user: decoded.id });
      if (another) {
        another.isDefault = true;
        await another.save();
      }
    }

    return Response.json({ message: "Address deleted" });
  } catch (error) {
    return Response.json({ message: "Error deleting address", error: error.message }, { status: 500 });
  }
}
