import { NextRequest, NextResponse } from "next/server";
import Investment from "@/lib/models/investment.model";
import { connectDB } from "@/lib/db/connect";
import mongoose from "mongoose";
import { investmentSchema } from "@/lib/models/investschema.zod";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();

    // validate here
    const parsed = investmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { investorId, startupId, amount } = parsed.data;

    // Rest of your logic stays same...
    const existingInvestment = await Investment.findOne({
      investorId: new mongoose.Types.ObjectId(investorId),
      startupId: new mongoose.Types.ObjectId(startupId),
    });

    if (existingInvestment) {
      existingInvestment.amount += amount;
      await existingInvestment.save();

      return NextResponse.json({
        success: true,
        investment: existingInvestment,
        message: "Investment updated",
      });
    }

    const investment = await Investment.create({
      investorId: new mongoose.Types.ObjectId(investorId),
      startupId: new mongoose.Types.ObjectId(startupId),
      amount,
    });

    return NextResponse.json({
      success: true,
      investment,
      message: "Investment created",
    });

  } catch (err: any) {
    console.error("Investment POST error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
