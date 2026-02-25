import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: userRow } = await supabase.from("users").select("role").eq("id", session.user.id).single();
    if (!userRow || userRow.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { product_id, image_id } = await req.json();
    if (!product_id || !image_id) return NextResponse.json({ error: "Missing params" }, { status: 400 });
    await supabase.from("product_images").update({ is_primary: false }).eq("product_id", Number(product_id));
    const { error } = await supabase.from("product_images").update({ is_primary: true }).eq("id", Number(image_id));
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}

