"use server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabaseServer";

/**
 * Verifies if the current user is an authenticated admin on the server.
 * Throws an error if validation fails.
 */
export async function checkAdmin() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    console.error("UNAUTHORIZED_ACCESS_ATTEMPT: User lacks admin role.");
    throw new Error("Unauthorized: Professional access only.");
  }

  return user;
}

/**
 * Promotes a user to admin manually (Use only for initial setup or local debugging)
 */
export async function makeAdmin(userId: string, email: string) {
  const admin = getServiceSupabase();
  
  // 1. Update public.users table
  const { error: dbError } = await admin
    .from("users")
    .upsert({ id: userId, email, role: "admin" }, { onConflict: "id" });
    
  if (dbError) throw new Error("Database update failed: " + dbError.message);

  // 2. Update auth server metadata (The master copy for middleware)
  const { data, error: authError } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: { role: "admin" }
  });

  if (authError) throw new Error("Auth metadata update failed: " + authError.message);
  
  return { success: true };
}
