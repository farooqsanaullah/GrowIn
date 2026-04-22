import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/user.model";
import Investment from "@/lib/models/investment.model";
import Startup from "@/lib/models/startup.model";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { isValidObjectId } from "@/lib/utils/validation";

const isDev = process.env.NODE_ENV === "development";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET investor by ID with detailed portfolio and stats
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid investor ID", 400);
    }

    // Get investor details
    const investor = await User.findOne({ _id: id, role: 'investor' })
      .select('userName name email profileImage bio city country fundingRange isVerified createdAt socialLinks')
      .lean();

    if (!investor) {
      return errorResponse("Investor not found", 404);
    }

    // Get investor's investments with startup details
    const investments = await Investment.find({ investorId: id })
      .populate({
        path: "startupId",
        select: "title description categoryType industry status profilePic ratingCount avgRating createdAt",
        populate: {
          path: "founders",
          select: "name userName profileImage"
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate investment statistics
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalInvestments = investments.length;
    const avgInvestment = totalInvestments > 0 ? totalInvested / totalInvestments : 0;
    
    // Get unique industries and categories invested in
    const industries = [...new Set(investments.map(inv => inv.startupId?.industry).filter(Boolean))];
    const categories = [...new Set(investments.map(inv => inv.startupId?.categoryType).filter(Boolean))];

    // Calculate monthly investment activity (last 12 months)
    const monthlyActivity = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthInvestments = investments.filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate >= date && invDate < nextMonth;
      });

      monthlyActivity.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count: monthInvestments.length,
        amount: monthInvestments.reduce((sum, inv) => sum + inv.amount, 0)
      });
    }

    // Portfolio with enhanced data
    const portfolio = investments.map(investment => {
      const startup = investment.startupId;
      if (!startup) return null;

      // Calculate estimated current value (simplified calculation)
      const monthsInvested = Math.max(1, 
        (new Date().getTime() - new Date(investment.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      
      // Simple growth calculation based on startup rating and status
      let growthMultiplier = 1;
      if (startup.status === 'active') {
        growthMultiplier += (startup.avgRating / 5) * 0.5; // Max 50% growth for 5-star
        growthMultiplier += Math.min(monthsInvested / 12, 1) * 0.3; // Time-based growth
      }

      const currentValue = investment.amount * growthMultiplier;
      const roi = ((currentValue - investment.amount) / investment.amount) * 100;

      return {
        investmentId: investment._id,
        startupId: startup._id,
        startupTitle: startup.title,
        startupDescription: startup.description,
        startupLogo: startup.profilePic,
        category: startup.categoryType,
        industry: startup.industry,
        status: startup.status,
        founders: startup.founders,
        rating: startup.avgRating || 0,
        ratingCount: startup.ratingCount || 0,
        investmentAmount: investment.amount,
        currentValue: Math.round(currentValue),
        roi: Math.round(roi * 100) / 100,
        investmentDate: investment.createdAt,
        monthsInvested: Math.round(monthsInvested)
      };
    }).filter(Boolean);

    // Calculate portfolio performance
    const totalCurrentValue = portfolio.filter(p => p !== null).reduce((sum, p) => sum + (p?.currentValue || 0), 0);
    const totalROI = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;

    const response = {
      investor: {
        ...investor,
        joinedDate: (investor as any).createdAt || new Date()
      },
      stats: {
        totalInvested,
        totalInvestments,
        avgInvestment: Math.round(avgInvestment),
        totalCurrentValue: Math.round(totalCurrentValue),
        totalROI: Math.round(totalROI * 100) / 100,
        activeInvestments: portfolio.filter(p => p && p.status === 'active').length,
        industries: industries.length,
        categories: categories.length,
        successRate: totalInvestments > 0 ? 
          Math.round((portfolio.filter(p => p && p.roi > 0).length / totalInvestments) * 100) : 0
      },
      portfolio,
      insights: {
        favoriteIndustries: industries.slice(0, 5),
        favoriteCategories: categories.slice(0, 5),
        monthlyActivity,
        topPerformers: portfolio
          .filter(p => p !== null)
          .sort((a, b) => (b?.roi || 0) - (a?.roi || 0))
          .slice(0, 5),
        recentInvestments: portfolio
          .filter(p => p !== null)
          .sort((a, b) => new Date(b?.investmentDate || 0).getTime() - new Date(a?.investmentDate || 0).getTime())
          .slice(0, 5)
      }
    };

    return successResponse(response, "Investor profile fetched successfully");

  } catch (error) {
    isDev && console.error("[GET API] investor by ID error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}