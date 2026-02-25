import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: userRow } = await supabase.from("users").select("role").eq("id", session.user.id).single();
    if (!userRow || userRow.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { public_id, image_id } = await req.json();
    if (!public_id || !image_id) return NextResponse.json({ error: "Missing params" }, { status: 400 });

    const destroy = await cloudinary.uploader.destroy(public_id);
    if (destroy.result !== "ok" && destroy.result !== "not found") {
      return NextResponse.json({ error: "Cloudinary delete failed" }, { status: 500 });
    }
    await supabase.from("product_images").delete().eq("id", image_id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}

