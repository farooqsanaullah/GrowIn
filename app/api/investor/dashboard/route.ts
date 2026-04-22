import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Investment from "@/lib/models/investment.model";
import Startup from "@/lib/models/startup.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";

const isDev = process.env.NODE_ENV === "development";

// GET investor dashboard data
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get user ID from query params or session
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Get investor's investments with startup details
    const investments = await Investment.find({ investorId: userId })
      .populate({
        path: "startupId",
        populate: {
          path: "founders",
          select: "name userName"
        },
        select: "title description categoryType industry status profilePic ratingCount avgRating createdAt equityRange"
      })
      .sort({ createdAt: -1 });

    // Calculate portfolio stats
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const portfolioCount = investments.length;
    
    // Calculate estimated current value (mock calculation based on time and performance)
    let totalCurrentValue = 0;
    const portfolioWithCurrentValue = investments.map(investment => {
      const monthsInvested = Math.max(1, Math.floor((new Date().getTime() - investment.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      const growthFactor = 1 + (Math.random() * 0.4 + 0.8) * (monthsInvested / 12); // Random growth between 80%-120% annually
      const currentValue = Math.round(investment.amount * growthFactor);
      totalCurrentValue += currentValue;
      
      return {
        ...investment.toObject(),
        currentValue,
        roi: ((currentValue - investment.amount) / investment.amount) * 100,
        status: currentValue > investment.amount * 1.1 ? 'growing' : 
                currentValue > investment.amount * 0.9 ? 'stable' : 'declining'
      };
    });

    const totalROI = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;

    // Get recent activity (last 10 investments)
    const recentActivity = portfolioWithCurrentValue.slice(0, 10).map(inv => ({
      id: inv._id,
      type: 'investment',
      startupName: inv.startupId.title,
      amount: inv.amount,
      date: inv.createdAt,
      status: inv.status
    }));

    // Category distribution
    const categoryDistribution = investments.reduce((acc, inv) => {
      const category = inv.startupId.categoryType || 'Other';
      acc[category] = (acc[category] || 0) + inv.amount;
      return acc;
    }, {} as Record<string, number>);

    // Top performing investments
    const topPerforming = portfolioWithCurrentValue
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 5);

    // Monthly investment trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthlyInvestments = investments.filter(inv => 
        inv.createdAt >= monthStart && inv.createdAt <= monthEnd
      );
      
      monthlyTrend.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount: monthlyInvestments.reduce((sum, inv) => sum + inv.amount, 0),
        count: monthlyInvestments.length
      });
    }

    const dashboardData = {
      stats: {
        totalInvested,
        totalCurrentValue,
        totalROI: Math.round(totalROI * 100) / 100,
        portfolioCount,
        avgInvestment: portfolioCount > 0 ? Math.round(totalInvested / portfolioCount) : 0
      },
      portfolio: portfolioWithCurrentValue,
      recentActivity,
      categoryDistribution,
      topPerforming,
      monthlyTrend
    };

    return NextResponse.json(dashboardData, { status: 200 });

  } catch (error) {
    isDev && console.error("[GET API] investor dashboard error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}