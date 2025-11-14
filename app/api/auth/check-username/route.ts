import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/user.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const username = req.nextUrl.searchParams.get("username")?.trim();
    if (!username) {
      return NextResponse.json({ available: false, message: "Username is required" }, { status: 400 });
    }

    const exists = await User.findOne({ userName: username });
    return NextResponse.json({ available: !exists });
  } catch (err) {
    console.error("[Check Username] Error:", err);
    return NextResponse.json({ available: false, message: "Internal Server Error" }, { status: 500 });
  }
}
