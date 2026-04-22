import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Investment from "@/lib/models/investment.model";
import Startup from "@/lib/models/startup.model";

const isDev = process.env.NODE_ENV === "development";

// GET portfolio stats for specific investor
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const { userId } = await params;

    // Get all investments for this investor
    const investments = await Investment.find({ investorId: userId })
      .populate({
        path: "startupId",
        select: "status avgRating createdAt"
      });

    if (!investments.length) {
      return NextResponse.json({
        success: true,
        data: {
          totalAmount: 0,
          totalInvestments: 0,
          portfolioValue: 0,
          activeInvestments: 0
        }
      }, { status: 200 });
    }

    // Calculate statistics
    const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalInvestments = investments.length;
    
    // Mock portfolio value calculation (in a real app, this would be more sophisticated)
    const portfolioValue = investments.reduce((sum, inv) => {
      // Simple growth calculation based on time and startup rating
      const monthsHeld = Math.max(1, Math.floor((new Date().getTime() - inv.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      const startupRating = inv.startupId?.avgRating || 3;
      const growthFactor = 1 + ((startupRating - 3) * 0.1 + 0.05) * (monthsHeld / 12);
      return sum + (inv.amount * Math.max(0.5, growthFactor)); // Minimum 50% of original value
    }, 0);

    // Count active investments (since we don't have status in Investment model, 
    // we'll consider all investments with active startups as active)
    const activeInvestments = investments.filter(inv => 
      inv.startupId?.status === 'active'
    ).length;

    const stats = {
      totalAmount: Math.round(totalAmount),
      totalInvestments,
      portfolioValue: Math.round(portfolioValue),
      activeInvestments
    };

    return NextResponse.json({
      success: true,
      data: stats
    }, { status: 200 });

  } catch (error) {
    isDev && console.error("[GET API] portfolio stats error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Internal Server Error" 
      },
      { status: 500 }
    );
  }
}