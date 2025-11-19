import { NextRequest, NextResponse } from "next/server";
import Investment from "@/lib/models/investment.model";
import { connectDB } from "@/lib/db/connect";
import mongoose from "mongoose";

connectDB();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startupId = searchParams.get("startupId");

    if (!startupId) return NextResponse.json({ success: false, message: "startupId is required" }, { status: 400 });

    const totalRaisedAggregation = await Investment.aggregate([
      { $match: { startupId: new mongoose.Types.ObjectId(startupId) } },
      { $group: { _id: "$startupId", total: { $sum: "$amount" } } }
    ]);

    const totalRaised = totalRaisedAggregation[0]?.total || 0;

    return NextResponse.json({ success: true, totalRaised });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
