import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();
  const products = await Product.find();
  return Response.json(products);
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
