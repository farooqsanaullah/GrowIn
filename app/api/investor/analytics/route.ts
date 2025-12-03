import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Investment from "@/lib/models/investment.model";
import Startup from "@/lib/models/startup.model";

const isDev = process.env.NODE_ENV === "development";

// GET investor analytics data
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const timeframe = searchParams.get('timeframe') || '12';

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Get all investments for this investor
    const investments = await Investment.find({ investorId: userId })
      .populate({
        path: "startupId",
        select: "title categoryType industry status createdAt ratingCount avgRating"
      })
      .sort({ createdAt: -1 });

    const months = parseInt(timeframe);
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);

    // Filter investments within timeframe
    const recentInvestments = investments.filter(inv => inv.createdAt >= cutoffDate);

    // Calculate portfolio performance over time
    const performanceData = [];
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const monthInvestments = investments.filter(inv => inv.createdAt <= monthEnd);
      const totalInvested = monthInvestments.reduce((sum, inv) => sum + inv.amount, 0);
      
      // Mock portfolio value calculation
      const portfolioValue = monthInvestments.reduce((sum, inv) => {
        const monthsHeld = Math.max(1, Math.floor((monthEnd.getTime() - inv.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        const growthFactor = 1 + (Math.random() * 0.4 + 0.8) * (monthsHeld / 12);
        return sum + (inv.amount * growthFactor);
      }, 0);

      performanceData.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        invested: totalInvested,
        value: Math.round(portfolioValue),
        count: monthInvestments.length
      });
    }

    // Category distribution analysis
    const categoryDistribution = recentInvestments.reduce((acc, inv) => {
      const category = inv.startupId.categoryType || 'Other';
      if (!acc[category]) {
        acc[category] = { amount: 0, count: 0, performance: [] };
      }
      acc[category].amount += inv.amount;
      acc[category].count += 1;
      
      // Calculate mock performance for this category
      const monthsInvested = Math.max(1, Math.floor((new Date().getTime() - inv.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      const growthFactor = 1 + (Math.random() * 0.4 + 0.8) * (monthsInvested / 12);
      const currentValue = inv.amount * growthFactor;
      const roi = ((currentValue - inv.amount) / inv.amount) * 100;
      acc[category].performance.push(roi);
      
      return acc;
    }, {} as Record<string, { amount: number; count: number; performance: number[] }>);

    // Calculate average performance per category
    const categoryAnalysis = Object.entries(categoryDistribution).map(([category, data]) => {
      const categoryData = data as { amount: number; count: number; performance: number[] };
      return {
        category,
        amount: categoryData.amount,
        count: categoryData.count,
        avgPerformance: categoryData.performance.length > 0 
          ? Math.round((categoryData.performance.reduce((sum, perf) => sum + perf, 0) / categoryData.performance.length) * 100) / 100
          : 0,
        percentage: Math.round((categoryData.amount / recentInvestments.reduce((sum, inv) => sum + inv.amount, 0)) * 100)
      };
    });

    // Risk analysis (based on investment distribution and timing)
    const riskMetrics = {
      diversificationScore: Math.min(100, (Object.keys(categoryDistribution).length * 20)), // Max 100 for 5+ categories
      concentrationRisk: Math.max(...categoryAnalysis.map(cat => cat.percentage)),
      temporalRisk: calculateTemporalRisk(recentInvestments),
      overallRiskScore: 'Medium' // Simplified risk assessment
    };

    // Top performing startups
    const topPerformers = recentInvestments.map(inv => {
      const monthsInvested = Math.max(1, Math.floor((new Date().getTime() - inv.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      const growthFactor = 1 + (Math.random() * 0.4 + 0.8) * (monthsInvested / 12);
      const currentValue = inv.amount * growthFactor;
      const roi = ((currentValue - inv.amount) / inv.amount) * 100;
      
      return {
        name: inv.startupId.title,
        category: inv.startupId.categoryType,
        investmentAmount: inv.amount,
        currentValue: Math.round(currentValue),
        roi: Math.round(roi * 100) / 100,
        investmentDate: inv.createdAt
      };
    }).sort((a, b) => b.roi - a.roi).slice(0, 5);

    // Investment timeline
    const investmentTimeline = recentInvestments.map(inv => ({
      date: inv.createdAt,
      startup: inv.startupId.title,
      amount: inv.amount,
      category: inv.startupId.categoryType
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      performance: performanceData,
      categoryAnalysis,
      riskMetrics,
      topPerformers,
      investmentTimeline,
      summary: {
        totalInvestments: recentInvestments.length,
        totalAmount: recentInvestments.reduce((sum, inv) => sum + inv.amount, 0),
        avgInvestment: recentInvestments.length > 0 
          ? Math.round(recentInvestments.reduce((sum, inv) => sum + inv.amount, 0) / recentInvestments.length)
          : 0,
        categoriesCount: Object.keys(categoryDistribution).length
      }
    }, { status: 200 });

  } catch (error) {
    isDev && console.error("[GET API] investor analytics error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Helper function to calculate temporal risk
function calculateTemporalRisk(investments: any[]): number {
  if (investments.length === 0) return 0;
  
  // Calculate how clustered investments are in time
  const dates = investments.map(inv => inv.createdAt.getTime()).sort();
  const timeSpan = dates[dates.length - 1] - dates[0];
  const avgGap = timeSpan / (dates.length - 1);
  
  // Higher clustering = higher temporal risk
  const gaps = [];
  for (let i = 1; i < dates.length; i++) {
    gaps.push(dates[i] - dates[i - 1]);
  }
  
  const variance = gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length;
  const riskScore = Math.min(100, variance / (avgGap * avgGap) * 100);
  
  return Math.round(riskScore);
}