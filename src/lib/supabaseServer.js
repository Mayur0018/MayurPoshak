import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key for server-side operations if needed, 
// but for standard user-data access in Route Handlers, a standard client can work
// if we handle cookies. However, for administrative notifications, Service Role is safer.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);

export default supabaseServer;
