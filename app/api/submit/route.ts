import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.description || !body.address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Submission data structure (ready for Supabase)
    const submission = {
      name: body.name,
      name_zh: body.nameZh || null,
      description: body.description,
      address: body.address,
      area: body.area,
      category: body.category,
      vibes: body.vibes || [],
      funny_score: body.funnyScore || 3,
      submitted_by: body.submitterName || "Anonymous Foodie",
      status: "pending" as const,
      created_at: new Date().toISOString(),
    };

    // TODO: Save to Supabase when configured
    // const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
    // if (isSupabaseConfigured() && supabase) {
    //   const { data, error } = await supabase
    //     .from('restaurants')
    //     .insert([submission]);
    //   if (error) throw error;
    // }

    console.log("[UGC Submission]", submission);

    return NextResponse.json({
      success: true,
      message: "Submission received! Admin is reviewing on an empty stomach 🍽️",
      id: crypto.randomUUID(),
    });
  } catch (error) {
    console.error("[UGC Submit Error]", error);
    return NextResponse.json(
      { error: "Submission failed" },
      { status: 500 }
    );
  }
}
