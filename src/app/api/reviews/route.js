import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id") || searchParams.get("productId");

    if (!productId) {
      return Response.json({ message: "Product ID required" }, { status: 400 });
    }

    await connectDB();
    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return Response.json(reviews);
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return Response.json({ message: "Error fetching reviews", error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { productId, rating, title, comment, images } = await request.json();

    if (!productId || !rating || !title || !comment) {
      return Response.json({ message: "Please provide all required fields" }, { status: 400 });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: user.id, product: productId });
    if (existingReview) {
      return Response.json({ message: "You have already reviewed this product" }, { status: 400 });
    }

    const review = await Review.create({
      user: user.id,
      product: productId,
      rating,
      title,
      comment,
      images: images || [],
    });

    return Response.json(review, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return Response.json({ message: "Error creating review", error: error.message }, { status: 500 });
  }
}
