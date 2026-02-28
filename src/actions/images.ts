import { getServerSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "./auth";

export async function setPrimaryImage(productId: number, imageId: number) {
  await checkAdmin();
  const supabase = await getServerSupabase();
  await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId);
  const { error } = await supabase.from("product_images").update({ is_primary: true }).eq("id", imageId);
  if (error) return { ok: false };
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function deleteProductImage(imageId: number) {
  await checkAdmin();
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) return { ok: false };
  revalidatePath("/admin/products");
  return { ok: true };
}
