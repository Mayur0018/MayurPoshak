"use server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabaseServer";

const WishlistSchema = z.object({
  product_id: z.number().int().positive(),
});

export async function toggleWishlist(userId: string, input: unknown) {
  const parsed = WishlistSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const supabase = await getServerSupabase();
  const { data: existing } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", parsed.data.product_id)
    .maybeSingle();
  if (existing) {
    await supabase.from("wishlist").delete().eq("id", existing.id);
    return { ok: true, added: false };
  }
  const { error } = await supabase.from("wishlist").insert({
    user_id: userId,
    product_id: parsed.data.product_id,
  });
  if (error) return { ok: false };
  return { ok: true, added: true };
}
