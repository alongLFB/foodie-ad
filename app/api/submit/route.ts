import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    // Insert into restaurants table with status 'pending'
    const { error } = await supabase.from("restaurants").insert([
      {
        name: data.name,
        description: data.description,
        address: data.address,
        area: data.area,
        category: data.category,
        vibes: data.vibes || [],
        funny_score: data.funnyScore,
        submitted_by: data.submitterName || "Anonymous",
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit to database" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
