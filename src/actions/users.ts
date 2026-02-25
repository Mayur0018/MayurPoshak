"use server";
import { getServerSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function setUserRole(id: string, role: "user" | "admin") {
  // Since getServerSupabase is async, we must await it to get the actual client.
  // Calling it without await returns a Promise<SupabaseClient>, which doesn't have the .from() method.
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("users").update({ role }).eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserBlocked(id: string, blocked: boolean) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("users").update({ blocked }).eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/users");
  return { ok: true };
}

