import { NextRequest } from "next/server";
import Investment from "@/lib/models/investment.model";
import { connectDB } from "@/lib/db/connect";
import mongoose from "mongoose";
import { investmentSchema, type InvestmentBody } from "@/lib/models/investment.zod";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    let body: InvestmentBody;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON format", 400);
    }

    const parsed = investmentSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { investorId, startupId, amount } = parsed.data;

    const investment = await Investment.create({
      investorId: new mongoose.Types.ObjectId(investorId),
      startupId: new mongoose.Types.ObjectId(startupId),
      amount,
    });

    return successResponse(investment, "Investment recorded successfully");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Investment POST error:", message);
    return errorResponse(message, 500);
  }
}
