"use server";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "./auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function setUserRole(id: string, role: "user" | "admin") {
  await checkAdmin();
  await connectDB();
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) return { ok: false };
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserBlocked(id: string, isBlocked: boolean) {
  await checkAdmin();
  await connectDB();
  const user = await User.findByIdAndUpdate(id, { isBlocked }, { new: true });
  if (!user) return { ok: false };
  revalidatePath("/admin/users");
  return { ok: true };
}

