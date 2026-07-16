import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    const expectedSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || "foodie2025";
    // Simple security check for V1
    if (secret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, action } = await req.json();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    if (action === "approve") {
      const { error } = await supabase
        .from("restaurants")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) {
        throw error;
      }
    } else if (action === "reject") {
      const { error } = await supabase
        .from("restaurants")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) {
        throw error;
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin approve error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
