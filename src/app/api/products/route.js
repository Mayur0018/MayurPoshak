import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const query = {};

    // Searching
    const searchTerm = searchParams.get("search");
    if (searchTerm) {
      const regex = new RegExp(searchTerm, "i");
      query.$or = [
        { name: regex },
        { brand: regex },
        { category: regex },
        { subCategory: regex },
      ];
    }

    // Filtering
    const categories = searchParams.getAll("category");
    if (categories.length === 1) query.category = categories[0];
    else if (categories.length > 1) query.category = { $in: categories };

    // Support multiple subCategory values for filtering (e.g. Gen Z style filter)
    const subCategories = searchParams.getAll("subCategory");
    if (subCategories.length === 1) query.subCategory = subCategories[0];
    else if (subCategories.length > 1) query.subCategory = { $in: subCategories };

    const brands = searchParams.getAll("brand");
    if (brands.length === 1) query.brand = brands[0];
    else if (brands.length > 1) query.brand = { $in: brands };

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

    // Availability
    const availability = searchParams.get("availability");
    if (availability === "in-stock") {
      query.stock = { $gt: 0 };
    } else if (availability === "out-of-stock") {
      query.stock = { $lte: 0 };
    }

    // Rating
    const minRating = searchParams.get("minRating");
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
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
  const { name, image, price, stock } = await request.json();

  if (!name || !image || !price) {
    return Response.json({ message: "All fields are required" }, { status: 400 });
  }

  const product = await Product.create({ name, image, price, stock: Number(stock ?? 10) });
  return Response.json(product);
}
