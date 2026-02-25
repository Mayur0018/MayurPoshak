import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: userRow } = await supabase.from("users").select("role").eq("id", session.user.id).single();
    if (!userRow || userRow.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { product_id, image_id, direction } = await req.json();
    if (!product_id || !image_id || !["up","down"].includes(direction)) return NextResponse.json({ error: "Bad request" }, { status: 400 });

    const { data: imgs } = await supabase.from("product_images").select("id,position").eq("product_id", product_id).order("position");
    if (!imgs) return NextResponse.json({ error: "No images" }, { status: 404 });
    const index = imgs.findIndex(i => i.id === image_id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= imgs.length) return NextResponse.json({ ok: true });

    const a = imgs[index], b = imgs[swapIndex];
    await supabase.from("product_images").update({ position: b.position }).eq("id", a.id);
    await supabase.from("product_images").update({ position: a.position }).eq("id", b.id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}

