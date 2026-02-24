"use server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

const CreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category_id: z.number().int().positive(),
  brand_id: z.number().int().optional(),
  base_price: z.number().positive(),
  discount_percentage: z.number().min(0).max(100).default(0),
  short_description: z.string().max(500).optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export async function createProduct(input: unknown) {
  const parsed = CreateSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.from("products").insert(parsed.data).select("id").single();
  if (error || !data) return { ok: false };
  revalidatePath("/admin/products");
  return { ok: true, id: data.id as number };
}

export async function deleteProduct(id: number) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function updateProduct(id: number, input: unknown) {
  const parsed = CreateSchema.partial().safeParse(input);
  if (!parsed.success) return { ok: false };
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("products").update(parsed.data).eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function toggleActive(id: number, is_active: boolean) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("products").update({ is_active }).eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function toggleFeatured(id: number, is_featured: boolean) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("products").update({ is_featured }).eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/products");
  return { ok: true };
}

const VariantSchema = z.object({
  size: z.string(),
  color: z.string().optional(),
  stock: z.number().int().min(0),
  price_override: z.number().positive().optional(),
});

export async function setProductVariants(product_id: number, variants: unknown) {
  const list = z.array(VariantSchema).safeParse(variants);
  if (!list.success) return { ok: false };
  const supabase = await getServerSupabase();
  await supabase.from("product_variants").delete().eq("product_id", product_id);
  if (list.data.length) {
    await supabase.from("product_variants").insert(
      list.data.map((v) => ({
        product_id,
        size: v.size,
        color: v.color,
        stock: v.stock,
        price_override: v.price_override,
      }))
    );
  }
  revalidatePath("/admin/products");
  return { ok: true };
}
