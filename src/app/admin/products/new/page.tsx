"use client";
import { useEffect, useState } from "react";
import { createProduct } from "@/actions/products";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function NewProduct() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: brs }] = await Promise.all([
        supabaseBrowser.from("categories").select("id,name,slug").order("name"),
        supabaseBrowser.from("brands").select("id,name").order("name"),
      ]);
      setCategories(cats ?? []);
      setBrands(brs ?? []);
    }
    load();
  }, []);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const payload = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      category_id: Number(formData.get("category_id") ?? 0),
      brand_id: formData.get("brand_id") ? Number(formData.get("brand_id")) : undefined,
      base_price: Number(formData.get("base_price") ?? 0),
      discount_percentage: Number(formData.get("discount_percentage") ?? 0),
      short_description: String(formData.get("description") ?? ""),
      is_active: String(formData.get("status")) !== "draft",
      is_featured: String(formData.get("featured")) === "on",
    };
    const res = await createProduct(payload as any);
    if (!res?.ok || !res?.id) { setLoading(false); return; }
    if (files.length > 0) {
      const fd = new FormData();
      fd.append("product_id", String(res.id));
      files.forEach((f) => fd.append("file", f));
      await fetch("/api/upload", { method: "POST", body: fd });
    }
    setLoading(false);
    window.location.href = "/admin/products";
  }

  return (
    <div className="bg-white border rounded p-4">
      <h2 className="text-lg font-semibold">Add Product</h2>
      <form action={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <input name="name" placeholder="Product Name" className="border p-2 md:col-span-2" required />
        <input name="slug" placeholder="Slug" className="border p-2 md:col-span-2" required />
        <select name="category_id" className="border p-2" required>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.slug})</option>
          ))}
        </select>
        <select name="brand_id" className="border p-2">
          <option value="">Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <input name="sku" placeholder="SKU" className="border p-2" />
        <input name="base_price" type="number" step="0.01" placeholder="Price" className="border p-2" required />
        <input name="discount_percentage" type="number" step="0.01" placeholder="Discount %" className="border p-2" />
        <input name="stock" type="number" placeholder="Stock" className="border p-2" />
        <select name="status" className="border p-2">
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
        <label className="flex items-center gap-2"><input type="checkbox" name="featured" />Featured</label>
        <textarea name="description" placeholder="Description (rich text supported)" className="border p-2 md:col-span-2" />
        <div className="md:col-span-2">
          <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
        </div>
        <button disabled={loading} className="bg-black text-white px-4 py-2 md:col-span-2">{loading ? "Saving..." : "Save Product"}</button>
      </form>
    </div>
  );
}
