import { connectDB } from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await getUserFromRequest();
    
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const wishlistItems = await Wishlist.find({ userId: user.id }).populate("productId");
    return new Response(JSON.stringify(wishlistItems), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    return Response.json({ message: "Error fetching wishlist", error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromRequest();
    
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return Response.json({ message: "Product ID is required" }, { status: 400 });
    }

    await connectDB();
    const wishlistItem = await Wishlist.create({ userId: user.id, productId });
    return Response.json(wishlistItem, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return Response.json({ message: "Product already in wishlist" }, { status: 400 });
    }
    return Response.json({ message: "Error adding to wishlist", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getUserFromRequest();
    
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let body = {};
    try {
      body = await request.json();
    } catch (_) {
      // no body — treat as clear-all
    }

    const { productId } = body;

    if (!productId) {
      // No productId → clear entire wishlist for this user
      await Wishlist.deleteMany({ userId: user.id });
      return Response.json({ message: "Wishlist cleared" });
    }

    await Wishlist.findOneAndDelete({ userId: user.id, productId });
    return Response.json({ message: "Removed from wishlist" });
  } catch (error) {
    return Response.json({ message: "Error removing from wishlist", error: error.message }, { status: 500 });
  }
}
