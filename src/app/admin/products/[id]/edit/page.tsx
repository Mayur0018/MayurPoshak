import { getServerSupabase } from "@/lib/supabaseServer";
import ProductImagesManager from "@/components/admin/ProductImagesManager";
import { updateProduct } from "@/actions/products";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const supabase = await getServerSupabase();
  const [{ data: product }, { data: images }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("product_images").select("id,product_id,image_url,public_id,is_primary,created_at").eq("product_id", id).order("is_primary", { ascending: false }).order("created_at", { ascending: false }),
  ]);

  async function save(formData: FormData) {
    "use server";
    const payload = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      base_price: Number(formData.get("base_price") ?? 0),
      discount_percentage: Number(formData.get("discount_percentage") ?? 0),
      short_description: String(formData.get("short_description") ?? ""),
      is_active: String(formData.get("is_active")) === "on",
      is_featured: String(formData.get("is_featured")) === "on",
    };
    await updateProduct(id, payload);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">Edit Product</h2>
        <form action={save} className="grid grid-cols-2 gap-3 mt-3">
          <input name="name" defaultValue={product?.name} className="border p-2 col-span-2" />
          <input name="slug" defaultValue={product?.slug} className="border p-2 col-span-2" />
          <input name="base_price" type="number" step="0.01" defaultValue={Number(product?.base_price ?? 0)} className="border p-2 col-span-1" />
          <input name="discount_percentage" type="number" step="0.01" defaultValue={Number(product?.discount_percentage ?? 0)} className="border p-2 col-span-1" />
          <textarea name="short_description" defaultValue={product?.short_description ?? ""} className="border p-2 col-span-2" />
          <label className="flex items-center gap-2"><input type="checkbox" name="is_active" defaultChecked={product?.is_active} />Active</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="is_featured" defaultChecked={product?.is_featured} />Featured</label>
          <button className="bg-black text-white px-4 py-2 col-span-2">Save</button>
        </form>
      </div>
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">Images</h2>
        <ProductImagesManager productId={id} existing={images ?? []} />
      </div>
    </div>
  );
}
