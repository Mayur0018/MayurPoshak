import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        users (
          full_name,
          avatar_url
        )
      `)
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
       console.error("Supabase error fetching reviews:", error);
       return NextResponse.json({ error: error.message || "Failed to fetch reviews" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("Review GET error:", e);
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { product_id, rating, title, comment, images } = await req.json();

    if (!product_id || !rating) {
      return NextResponse.json({ error: "Product ID and rating are required" }, { status: 400 });
    }

    // --- LAZY PROFILE CREATION ---
    // Ensure the user exists in public.users to satisfy foreign key constraint
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error checking user profile:", profileError);
    }

    if (!profile) {
      console.log("Creating missing profile for user:", user.id);
      const { error: insertError } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
          avatar_url: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email?.split('@')[0] || 'U'}`
        });

      if (insertError) {
        console.error("Failed to create lazy profile:", insertError);
        // We continue, but the review insert might fail if this insert failed
      }
    }
    // ----------------------------

    // Check if user has already reviewed this product
    const { data: existing, error: checkError } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", String(product_id))
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing review:", checkError);
      // If it's a cast error, it likely means the schema hasn't been updated to 'text'
      if (checkError.code === "22P02") {
        return NextResponse.json({ error: "Database schema mismatch. Please ensure product_id is text in Supabase." }, { status: 500 });
      }
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        product_id: String(product_id),
        rating,
        title,
        comment,
        images: images || [],
        is_verified_purchase: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting review:", error);
      return NextResponse.json({ error: error.message || "Failed to submit review" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("Review POST error:", e);
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}
