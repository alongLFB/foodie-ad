import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || "admin";

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    
    // Convert camelCase to snake_case for Supabase
    const supabaseData = {
      name: body.name,
      name_zh: body.nameZh,
      category: body.category,
      area: body.area,
      rating: body.rating,
      lat: body.lat,
      lng: body.lng,
      funny_quote: body.funnyQuote,
      funny_quote_zh: body.funnyQuoteZh,
      description: body.description,
      description_zh: body.descriptionZh,
      funny_score: body.funnyScore,
      price_level: body.priceLevel || 2, // fallback
      price_range: body.priceRange,
      must_order: body.mustOrder,
      parking: body.parking,
      hours: body.hours,
      phone: body.phone,
      google_maps_url: body.googleMapsUrl,
      cover_image: body.coverImage,
      images: body.images || [],
      vibes: body.vibes || [],
      submitted_by: body.submittedBy,
      status: body.status || "approved", // Allow updating status if needed
    };

    const { data, error } = await supabase
      .from("restaurants")
      .update(supabaseData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to update restaurant:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || "admin";

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const { error } = await supabase
      .from("restaurants")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete restaurant:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
