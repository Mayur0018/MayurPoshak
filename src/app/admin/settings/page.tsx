import { getServerSupabase } from "@/lib/supabaseServer";
import { syncCategoriesFromStatic } from "@/actions/categories";

export default async function AdminSettings() {
  async function syncCategories() {
    "use server";
    await syncCategoriesFromStatic();
  }

  const supabase = await getServerSupabase();
  const urlSet = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonSet = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const cloudNameSet = Boolean(process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME);
  const mongoSet = Boolean(process.env.MONGODB_URI);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border rounded p-4">
        <h2 className="text-lg font-semibold mb-3">Environment</h2>
        <div className="space-y-2 text-sm">
          <div>Supabase URL: {urlSet ? "✓" : "✗"}</div>
          <div>Supabase ANON: {anonSet ? "✓" : "✗"}</div>
          <div>Cloudinary Name: {cloudNameSet ? "✓" : "✗"}</div>
          <div>MongoDB URI: {mongoSet ? "✓" : "✗"}</div>
        </div>
      </div>
      <div className="bg-white border rounded p-4">
        <h2 className="text-lg font-semibold mb-3">Data Utilities</h2>
        <form action={syncCategories}>
          <button className="border px-3 py-2 text-sm">Sync categories from static list</button>
        </form>
      </div>
    </div>
  );
}
