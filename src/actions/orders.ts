import { getServerSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "./auth";

export async function updateOrderStatus(id: number, status: string) {
  await checkAdmin();
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/orders");
  return { ok: true };
}
