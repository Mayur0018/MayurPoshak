import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { cloudinary } from "@/lib/cloudinary";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const productIdRaw = form.get("product_id");
    const productId = productIdRaw ? Number(productIdRaw) : 0;

    const files = form.getAll("file").filter(Boolean) as File[];
    if (files.length === 0) return NextResponse.json({ error: "No files" }, { status: 400 });

    const results: Array<{ secure_url: string; public_id: string }> = [];
    for (const file of files) {
      if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
      const buf = Buffer.from(await file.arrayBuffer());
      if (buf.length > MAX_SIZE) return NextResponse.json({ error: "File too large" }, { status: 413 });
      const folder = "mayur-poshak/products";
      const res = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, data) => {
            if (error || !data) return reject(error ?? new Error("Upload failed"));
            resolve({ secure_url: data.secure_url!, public_id: data.public_id! });
          }
        );
        stream.end(buf);
      });
      results.push(res);
    }

    if (productId) {
      const supabase = await getSupabaseServer();
      for (const r of results) {
        await supabase.from("product_images").insert({
          product_id: productId,
          image_url: r.secure_url,
          public_id: r.public_id,
        });
      }
      return NextResponse.json({ ok: true, images: results });
    }

    // If no product_id provided, return first URL like JS route contract
    const first = results[0];
    return NextResponse.json({ ok: true, url: first.secure_url, images: results });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}
