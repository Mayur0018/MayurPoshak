import { connectDB } from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import supabase from "@/lib/supabaseClient";

export async function GET(request) {
  try {
    await connectDB();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const wishlistItems = await Wishlist.find({ userId: user.id }).populate("productId");
    return Response.json(wishlistItems);
  } catch (error) {
    return Response.json({ message: "Error fetching wishlist", error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return Response.json({ message: "Product ID is required" }, { status: 400 });
    }

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
    await connectDB();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return Response.json({ message: "Product ID is required" }, { status: 400 });
    }

    await Wishlist.findOneAndDelete({ userId: user.id, productId });
    return Response.json({ message: "Removed from wishlist" });
  } catch (error) {
    return Response.json({ message: "Error removing from wishlist", error: error.message }, { status: 500 });
  }
}
