import { NextResponse } from "next/server";
import { uploadProductImage } from "@/services/storage";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  try {
    const supabaseUser = createServerComponentClient({ cookies });
    const { data: { session } } = await supabaseUser.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: userRow } = await supabaseUser.from("users").select("role").eq("id", session.user.id).single();
    if (!userRow || userRow.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const productId = Number(form.get("product_id") ?? 0);
    const isPrimary = String(form.get("is_primary")) === "true";
    if (!file || !productId) {
      return NextResponse.json({ error: "Missing file or product_id" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = (file.type?.split("/")?.[1] ?? "jpg").toLowerCase();
    const path = `product-${productId}/${Date.now()}.${ext}`;
    const publicUrl = await uploadProductImage(buffer, path);
    if (!publicUrl) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
    const { error } = await supabaseUser.from("product_images").insert({
      product_id: productId,
      image_url: publicUrl,
      is_primary: isPrimary,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}
