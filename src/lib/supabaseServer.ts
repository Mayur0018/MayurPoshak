import { createClient } from "@supabase/supabase-js";
import { getSupabaseServer } from "./supabase/server";

export async function getServerSupabase() {
  return await getSupabaseServer();
}

export function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string;
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY is missing, falling back to ANON_KEY");
  }
  
  return createClient(url, key);
}

// Default export uses service key if available, otherwise anon
const supabaseServer = getServiceSupabase();
export default supabaseServer;
