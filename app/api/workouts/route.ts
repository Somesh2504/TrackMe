import { NextResponse } from "next/server";
import { supabase } from "../../../lib/superbaseClient";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { focus, exercises } = data;

    const { error } = await supabase
      .from("workout")
      .insert([{ focus, exercises }]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}