import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

/* =========================
   GET PRODUCT BY ID
========================= */
export async function GET(request, context) {
  await connectDB();

  const { id } = await context.params;
  if (!id || typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return Response.json({ message: "Invalid ID" }, { status: 400 });
  }
  try {
    const product = await Product.findById(id);

    if (!product) {
      return Response.json(
        { message: "Product Not Found" },
        { status: 404 }
      );
    }

    return Response.json(product);
  } catch (error) {
    return Response.json(
      { message: "Error fetching product", error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   UPDATE PRODUCT BY ID (PUT)
========================= */
export async function PUT(request, context) {
  await connectDB();

  const { id } = await context.params;
  if (!id || typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return Response.json({ message: "Invalid ID" }, { status: 400 });
  }
  const { name, image, price } = await request.json();

  try {
    if (!name || !image || !price) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { name, image, price }, { new: true });

    if (!updatedProduct) {
      return Response.json(
        { message: "Product Not Found" },
        { status: 404 }
      );
    }

    return Response.json(updatedProduct, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Error updating product", error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE PRODUCT BY ID
========================= */
export async function DELETE(request, context) {
  await connectDB();

  const { id } = await context.params;
  if (!id || typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return Response.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return Response.json(
        { message: "Product Not Found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error deleting product", error: error.message },
      { status: 500 }
    );
  }
}
