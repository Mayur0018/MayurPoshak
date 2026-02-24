"use client";
import { useState, useMemo } from "react";

export default function ProductImagesManager({ productId, existing }: { productId: number; existing: Array<any> }) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const previews = useMemo(() => files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })), [files]);

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...list]);
  }
  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...list]);
  }
  async function upload() {
    if (files.length === 0) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("product_id", String(productId));
    files.forEach((f) => fd.append("file", f));
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setLoading(false);
    if (!res.ok) return;
    setFiles([]);
    location.reload();
  }
  async function removeImage(imageId: number, publicId: string) {
    setLoading(true);
    const res = await fetch("/api/upload/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_id: imageId, public_id: publicId }),
    });
    setLoading(false);
    if (!res.ok) return;
    location.reload();
  }
  async function makePrimary(imageId: number) {
    setLoading(true);
    const res = await fetch("/api/upload/primary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, image_id: imageId }),
    });
    setLoading(false);
    if (!res.ok) return;
    location.reload();
  }

  return (
    <div className="border rounded p-3">
      <div
        className="border-dashed border-2 rounded p-4 text-center bg-gray-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        Drag & drop images here
      </div>
      <div className="mt-2">
        <input type="file" accept="image/*" multiple onChange={onSelect} />
      </div>
      <div className="grid grid-cols-4 gap-2 mt-3">
        {previews.map((p) => (
          <div key={p.name} className="border rounded overflow-hidden">
            <img src={p.url} alt="" className="w-full h-24 object-cover" />
          </div>
        ))}
      </div>
      <button disabled={loading} onClick={upload} className="mt-3 border px-3 py-1 text-sm">
        {loading ? "Uploading..." : "Upload"}
      </button>

      <div className="mt-4">
        <div className="text-sm font-medium mb-2">Existing</div>
        <div className="flex flex-wrap gap-2">
          {existing.map((img: any) => (
            <div key={img.id} className="border rounded overflow-hidden">
              <img src={img.image_url} alt="" className="w-24 h-24 object-cover" />
              <div className="flex items-center justify-between px-2 py-1">
                <span className={`text-xs ${img.is_primary ? "text-green-700" : "text-gray-500"}`}>{img.is_primary ? "Primary" : " "}</span>
                <div className="flex items-center gap-1">
                  <button disabled={loading} onClick={() => fetch("/api/upload/reorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: productId, image_id: img.id, direction: "up" }) }).then(() => location.reload())} className="border px-2 py-1 text-xs">Up</button>
                  <button disabled={loading} onClick={() => fetch("/api/upload/reorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: productId, image_id: img.id, direction: "down" }) }).then(() => location.reload())} className="border px-2 py-1 text-xs">Down</button>
                  <button disabled={loading} onClick={() => makePrimary(img.id)} className="border px-2 py-1 text-xs">Make Primary</button>
                  <button disabled={loading} onClick={() => removeImage(img.id, img.public_id)} className="border px-2 py-1 text-xs text-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
