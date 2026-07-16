import { NextRequest, NextResponse } from "next/server";
import { getApprovedRestaurants } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const mockRestaurants = getApprovedRestaurants();
    let supabaseRestaurants: any[] = [];

    if (supabase) {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("status", "approved");

      if (!error && data) {
        // Map snake_case to camelCase
        supabaseRestaurants = data.map((item) => ({
          ...item,
          funnyScore: item.funny_score,
          submittedBy: item.submitted_by,
          createdAt: item.created_at,
          coverImage: item.cover_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
          images: item.images || [],
          // Provide some defaults if missing
          lat: item.lat || 24.4539,
          lng: item.lng || 54.3773,
          rating: item.rating || 0,
          funnyQuote: item.funny_quote || "Good vibes only.",
          priceLevel: item.price_level || 2,
        }));
      }
    }

    const allRestaurants = [...supabaseRestaurants, ...mockRestaurants];

    return NextResponse.json({
      restaurants: allRestaurants,
      total: allRestaurants.length,
    });
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
