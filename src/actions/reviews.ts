"use server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabaseServer";

const ReviewSchema = z.object({
  product_id: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

export async function upsertReview(userId: string, input: unknown) {
  const parsed = ReviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const supabase = await getServerSupabase();
  const { data: prior } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", parsed.data.product_id)
    .maybeSingle();
  const payload = {
    user_id: userId,
    product_id: parsed.data.product_id,
    rating: parsed.data.rating,
    comment: parsed.data.comment ?? null,
  };
  if (prior) {
    const { error } = await supabase.from("reviews").update(payload).eq("id", prior.id);
    if (error) return { ok: false };
    return { ok: true, updated: true };
  } else {
    const { error } = await supabase.from("reviews").insert(payload);
    if (error) return { ok: false };
    return { ok: true, created: true };
  }
}

export async function deleteReview(userId: string, productId: number) {
  const supabase = await getServerSupabase();
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) return { ok: false };
  return { ok: true };
}
