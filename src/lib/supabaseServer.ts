import { createClient } from "@supabase/supabase-js";
import { getSupabaseServer } from "./supabase/server";

export async function getServerSupabase() {
  return await getSupabaseServer();
}

export function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  return createClient(url, key);
}
