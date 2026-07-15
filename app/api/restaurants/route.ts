import { NextRequest, NextResponse } from "next/server";
import { getApprovedRestaurants } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const restaurants = getApprovedRestaurants();
    return NextResponse.json({ restaurants, total: restaurants.length });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
