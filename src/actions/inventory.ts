"use server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabaseServer";

const DecrementSchema = z.object({
  variant_id: z.number().int().positive(),
  quantity: z.number().int().min(1),
});

export async function decrementStock(input: unknown) {
  const parsed = DecrementSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const supabase = await getServerSupabase();
  const { data: variant } = await supabase
    .from("product_variants")
    .select("id, stock")
    .eq("id", parsed.data.variant_id)
    .single();
  if (!variant) return { ok: false };
  if ((variant.stock ?? 0) < parsed.data.quantity) return { ok: false, reason: "insufficient" };
  const { error } = await supabase
    .from("product_variants")
    .update({ stock: (variant.stock ?? 0) - parsed.data.quantity })
    .eq("id", parsed.data.variant_id);
  if (error) return { ok: false };
  return { ok: true };
}
