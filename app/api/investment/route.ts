import { NextRequest } from "next/server";
import Investment from "@/lib/models/investment.model";
import { connectDB } from "@/lib/db/connect";
import mongoose, { Document } from "mongoose";
import { investmentSchema, type InvestmentBody } from "@/lib/models/investschema.zod";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export interface IInvestment {
  investorId: mongoose.Types.ObjectId;
  startupId: mongoose.Types.ObjectId;
  amount: number;
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
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

    const existingInvestment: (IInvestment & Document) | null =
      await Investment.findOne({
        investorId: new mongoose.Types.ObjectId(investorId),
        startupId: new mongoose.Types.ObjectId(startupId),
      });

    if (existingInvestment) {
      existingInvestment.amount += amount;
      await existingInvestment.save();

      return successResponse(existingInvestment, "Investment updated");
    }

    const investment: IInvestment & Document = await Investment.create({
      investorId: new mongoose.Types.ObjectId(investorId),
      startupId: new mongoose.Types.ObjectId(startupId),
      amount,
    });

    return successResponse(investment, "Investment created");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Investment POST error:", message);
    return errorResponse(message, 500);
  }
}
