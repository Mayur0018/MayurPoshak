"use server";
import { getServerSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function setUserRole(id: string, role: "user" | "admin") {
  const supabase = getServerSupabase();
  const { error } = await supabase.from("users").update({ role }).eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserBlocked(id: string, blocked: boolean) {
  const supabase = getServerSupabase();
  const { error } = await supabase.from("users").update({ blocked }).eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/users");
  return { ok: true };
}

