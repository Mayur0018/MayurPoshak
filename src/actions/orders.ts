"use server";
import { getServerSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(id: number, status: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/orders");
  return { ok: true };
}
