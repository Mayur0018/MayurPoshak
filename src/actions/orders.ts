import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "./auth";

export async function updateOrderStatus(id: string, status: string) {
  await checkAdmin();
  await connectDB();
  // @ts-ignore
  await Order.findByIdAndUpdate(id, { status });
  revalidatePath("/admin/orders");
  return { ok: true };
}
