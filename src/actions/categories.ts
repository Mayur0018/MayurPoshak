"use server";
import { getServerSupabase } from "@/lib/supabaseServer";
import { category as staticCategories } from "@/data/Category";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "./auth";

export async function syncCategoriesFromStatic() {
  await checkAdmin();
  const supabase = await getServerSupabase();
  const { data: existing } = await supabase.from("categories").select("id,slug");
  const existingSlugs = new Set((existing ?? []).map((c: any) => c.slug));
  const toInsert = staticCategories
    .filter((c: any) => !existingSlugs.has(c.slug))
    .map((c: any) => ({ name: c.text, slug: c.slug }));
  if (toInsert.length > 0) {
    await supabase.from("categories").upsert(toInsert, { onConflict: "slug" } as any);
    revalidatePath("/admin/products");
  }
  return { ok: true, inserted: toInsert.length };
}
