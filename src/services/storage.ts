import { getServiceSupabase } from "@/lib/supabaseServer";

export async function uploadProductImage(file: Buffer, path: string) {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.storage.from("product-images").upload(path, file, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) return null;
  const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(data.path);
  return urlData.publicUrl;
}

