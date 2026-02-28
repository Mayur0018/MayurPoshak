"use server";
import { getServerSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "./auth";

export async function setUserRole(id: string, role: "user" | "admin") {
  await checkAdmin();
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("users").update({ role }).eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserBlocked(id: string, blocked: boolean) {
  await checkAdmin();
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("users").update({ blocked }).eq("id", id);
  if (error) return { ok: false };
  revalidatePath("/admin/users");
  return { ok: true };
}

