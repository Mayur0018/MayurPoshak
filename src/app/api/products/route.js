import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const query = {};

    // Filtering
    const category = searchParams.get("category");
    if (category) query.category = category;

    // Support multiple subCategory values for filtering (e.g. Gen Z style filter)
    const subCategories = searchParams.getAll("subCategory");
    if (subCategories.length === 1) query.subCategory = subCategories[0];
    else if (subCategories.length > 1) query.subCategory = { $in: subCategories };

    const brand = searchParams.get("brand");
    if (brand) query.brand = brand;

    const color = searchParams.getAll("color");
    if (color.length > 0) query.color = { $in: color };

    const size = searchParams.getAll("size");
    if (size.length > 0) query.size = { $in: size };

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    const sort = searchParams.get("sort");
    let sortOptions = { createdAt: -1 }; // Default: Newest
    if (sort === "price-asc") sortOptions = { price: 1 };
    if (sort === "price-desc") sortOptions = { price: -1 };
    if (sort === "rating") sortOptions = { rating: -1 };

    const products = await Product.find(query).sort(sortOptions);
    return Response.json(products);
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ message: "Failed to fetch products", error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();
  const { name, image, price } = await request.json();

  if (!name || !image || !price) {
    return Response.json({ message: "All fields are required" }, { status: 400 });
  }

  const product = await Product.create({ name, image, price });
  return Response.json(product);
}   
