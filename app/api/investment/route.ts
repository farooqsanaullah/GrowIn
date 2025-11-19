import { NextRequest, NextResponse } from "next/server";
import Investment from "@/lib/models/investment.model";
import { connectDB } from "@/lib/db/connect";
import mongoose from "mongoose";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { investorId, startupId, amount } = body;

    if (!investorId || !startupId || !amount) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ success: false, message: "Invalid investment amount" }, { status: 400 });
    }

    const existingInvestment = await Investment.findOne({
      investorId: new mongoose.Types.ObjectId(investorId),
      startupId: new mongoose.Types.ObjectId(startupId),
    });

    if (existingInvestment) {
      existingInvestment.amount += amountNum;
      await existingInvestment.save();

      return NextResponse.json({ success: true, investment: existingInvestment, message: "Investment updated" });
    }

    const investment = await Investment.create({
      investorId: new mongoose.Types.ObjectId(investorId),
      startupId: new mongoose.Types.ObjectId(startupId),
      amount: amountNum,
    });

    return NextResponse.json({ success: true, investment, message: "Investment created" });

  } catch (err: any) {
    console.error("Investment POST error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
