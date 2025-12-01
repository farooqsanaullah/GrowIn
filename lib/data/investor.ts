import { connectDB } from "@/lib/db/connect";
import Investment from "@/lib/models/investment.model";
import Startup from "@/lib/models/startup.model";

export interface AnalyticsData {
  portfolioValue: number;
  totalInvested: number;
  totalReturn: number;
  monthlyData: Array<{
    month: string;
    invested: number;
    returns: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    value: number;
    percentage: number;
    count: number;
  }>;
  performanceMetrics: {
    totalStartups: number;
    activeInvestments: number;
    avgInvestmentSize: number;
    bestPerforming: {
      name: string;
      roi: number;
    } | null;
    worstPerformer: string;
    worstReturn: number;
  };
  trendsData: {
    quarterlyGrowth: number;
    yearOverYear: number;
    monthlyGrowth: number;
  };
}

export async function fetchInvestorAnalytics(userId: string): Promise<AnalyticsData | null> {
  try {
    await connectDB();

    // Get all investments for this investor
    const investments = await Investment.find({ investorId: userId })
      .populate({
        path: 'startupId',
        model: Startup,
        select: 'name description category currentValuation fundingGoal'
      })
      .sort({ createdAt: -1 });

    if (!investments.length) {
      return {
        portfolioValue: 0,
        totalInvested: 0,
        totalReturn: 0,
        monthlyData: [],
        categoryBreakdown: [],
        performanceMetrics: {
          totalStartups: 0,
          activeInvestments: 0,
          avgInvestmentSize: 0,
          bestPerforming: null,
          worstPerformer: "N/A",
          worstReturn: 0
        },
        trendsData: {
          quarterlyGrowth: 0,
          yearOverYear: 0,
          monthlyGrowth: 0
        }
      };
    }

    // Calculate basic metrics
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const portfolioValue = investments.reduce((sum, inv) => {
      const startup = inv.startupId as any;
      if (startup?.currentValuation && startup?.fundingGoal) {
        // Calculate current value based on startup's current valuation
        const ownershipPercent = inv.amount / startup.fundingGoal;
        return sum + (startup.currentValuation * ownershipPercent);
      }
      return sum + inv.amount; // Fallback to original investment if no valuation data
    }, 0);
    
    const totalReturn = portfolioValue - totalInvested;

    // Generate monthly data for the last 12 months
    const monthlyData = generateMonthlyData(investments);

    // Calculate category breakdown
    const categoryBreakdown = generateCategoryBreakdown(investments);

    // Calculate performance metrics
    const performanceMetrics = {
      totalStartups: investments.length,
      activeInvestments: investments.filter(inv => {
        const startup = inv.startupId as any;
        return startup && startup.currentValuation;
      }).length,
      avgInvestmentSize: totalInvested / investments.length,
      bestPerforming: getBestPerforming(investments),
      worstPerformer: getWorstPerforming(investments)?.name || "N/A",
      worstReturn: getWorstPerforming(investments)?.roi || 0
    };

    // Calculate trends (simplified for now)
    const trendsData = {
      quarterlyGrowth: calculateQuarterlyGrowth(investments),
      yearOverYear: calculateYearOverYearGrowth(investments),
      monthlyGrowth: calculateMonthlyGrowth(investments)
    };

    return {
      portfolioValue,
      totalInvested,
      totalReturn,
      monthlyData,
      categoryBreakdown,
      performanceMetrics,
      trendsData
    };

  } catch (error) {
    console.error('Error fetching investor analytics:', error);
    return null;
  }
}

function generateMonthlyData(investments: any[]) {
  const monthlyData = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
    
    const monthlyInvestments = investments.filter(inv => {
      const invDate = new Date(inv.createdAt);
      return invDate.toISOString().slice(0, 7) === monthKey;
    });
    
    const invested = monthlyInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    
    monthlyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      invested,
      returns: invested * 0.1 // Simplified calculation
    });
  }
  
  return monthlyData;
}

function generateCategoryBreakdown(investments: any[]) {
  const categoryMap = new Map();
  const categoryCount = new Map();
  let totalValue = 0;
  
  investments.forEach(inv => {
    const startup = inv.startupId as any;
    if (startup?.category) {
      const currentValue = categoryMap.get(startup.category) || 0;
      const currentCount = categoryCount.get(startup.category) || 0;
      categoryMap.set(startup.category, currentValue + inv.amount);
      categoryCount.set(startup.category, currentCount + 1);
      totalValue += inv.amount;
    }
  });
  
  const breakdown = Array.from(categoryMap.entries()).map(([category, value]) => ({
    category,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    count: categoryCount.get(category) || 0
  }));
  
  return breakdown.sort((a, b) => b.value - a.value);
}

function getBestPerforming(investments: any[]) {
  let bestROI = -Infinity;
  let bestStartup = null;
  
  investments.forEach(inv => {
    const startup = inv.startupId as any;
    if (startup?.currentValuation && startup?.fundingGoal) {
      const roi = ((startup.currentValuation / startup.fundingGoal) - 1) * 100;
      if (roi > bestROI) {
        bestROI = roi;
        bestStartup = {
          name: startup.name,
          roi
        };
      }
    }
  });
  
  return bestStartup;
}

function getWorstPerforming(investments: any[]): { name: string; roi: number } | null {
  let worstROI = Infinity;
  let worstStartup: { name: string; roi: number } | null = null;
  
  investments.forEach(inv => {
    const startup = inv.startupId as any;
    if (startup?.currentValuation && startup?.fundingGoal) {
      const roi = ((startup.currentValuation / startup.fundingGoal) - 1) * 100;
      if (roi < worstROI) {
        worstROI = roi;
        worstStartup = {
          name: startup.name,
          roi
        };
      }
    }
  });
  
  return worstStartup;
}

function calculateQuarterlyGrowth(investments: any[]): number {
  // Simplified calculation - would need more complex logic for real data
  const currentQuarter = investments.filter(inv => {
    const invDate = new Date(inv.createdAt);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return invDate >= threeMonthsAgo;
  });
  
  return currentQuarter.length > 0 ? Math.random() * 20 - 10 : 0; // Placeholder
}

function calculateYearOverYearGrowth(investments: any[]): number {
  // Simplified calculation
  const thisYear = investments.filter(inv => {
    const invDate = new Date(inv.createdAt);
    return invDate.getFullYear() === new Date().getFullYear();
  });
  
  return thisYear.length > 0 ? Math.random() * 30 - 15 : 0; // Placeholder
}

function calculateMonthlyGrowth(investments: any[]): number {
  // Simplified calculation
  const thisMonth = investments.filter(inv => {
    const invDate = new Date(inv.createdAt);
    const now = new Date();
    return invDate.getMonth() === now.getMonth() && 
           invDate.getFullYear() === now.getFullYear();
  });
  
  return thisMonth.length > 0 ? Math.random() * 10 - 5 : 0; // Placeholder
}