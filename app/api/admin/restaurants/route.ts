import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || "admin";

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Map snake_case to camelCase
    const mappedData = (data || []).map((item) => ({
      ...item,
      nameZh: item.name_zh,
      funnyQuote: item.funny_quote,
      funnyQuoteZh: item.funny_quote_zh,
      descriptionZh: item.description_zh,
      funnyScore: item.funny_score,
      priceLevel: item.price_level,
      priceRange: item.price_range,
      mustOrder: item.must_order,
      parking: item.parking,
      googleMapsUrl: item.google_maps_url,
      coverImage: item.cover_image,
      submittedBy: item.submitted_by,
      createdAt: item.created_at,
    }));

    return NextResponse.json({ restaurants: mappedData });
  } catch (error) {
    console.error("Failed to fetch all restaurants:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
      submitted_by: body.submittedBy || "Admin",
      status: "approved" // Directly approved when added by admin
    };

    const { data, error } = await supabase
      .from("restaurants")
      .insert([supabaseData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to add restaurant:", error);
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}
