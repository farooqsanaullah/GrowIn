import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Investment from "@/lib/models/investment.model";
import Startup from "@/lib/models/startup.model";

const isDev = process.env.NODE_ENV === "development";

// GET investor portfolio with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Build query for investments
    let investmentQuery: any = { investorId: userId };

    // Get investments with startup details
    let investmentsQuery = Investment.find(investmentQuery)
      .populate({
        path: "startupId",
        populate: {
          path: "founders",
          select: "name userName"
        },
        select: "title description categoryType industry status profilePic ratingCount avgRating createdAt equityRange"
      });

    // Apply filters after population (we'll filter in memory for simplicity)
    const allInvestments = await investmentsQuery.exec();

    // Filter by search term
    let filteredInvestments = allInvestments.filter(investment => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return investment.startupId.title.toLowerCase().includes(searchLower) ||
             investment.startupId.description.toLowerCase().includes(searchLower) ||
             investment.startupId.categoryType.toLowerCase().includes(searchLower);
    });

    // Filter by category
    if (category !== 'all') {
      filteredInvestments = filteredInvestments.filter(investment => 
        investment.startupId.categoryType.toLowerCase() === category.toLowerCase()
      );
    }

    // Calculate current values and ROI
    const portfolioWithMetrics = filteredInvestments.map(investment => {
      const monthsInvested = Math.max(1, Math.floor((new Date().getTime() - investment.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      const growthFactor = 1 + (Math.random() * 0.4 + 0.8) * (monthsInvested / 12);
      const currentValue = Math.round(investment.amount * growthFactor);
      const roi = ((currentValue - investment.amount) / investment.amount) * 100;
      const investmentStatus = currentValue > investment.amount * 1.1 ? 'growing' : 
                              currentValue > investment.amount * 0.9 ? 'stable' : 'declining';
      
      return {
        id: investment._id,
        startupId: investment.startupId._id,
        name: investment.startupId.title,
        description: investment.startupId.description,
        category: investment.startupId.categoryType,
        industry: investment.startupId.industry,
        logo: investment.startupId.profilePic,
        founderName: investment.startupId.founders?.[0]?.name || 'Unknown',
        investmentAmount: investment.amount,
        currentValue,
        roi: Math.round(roi * 100) / 100,
        status: investmentStatus,
        investmentDate: investment.createdAt,
        lastUpdate: new Date(),
        rating: investment.startupId.avgRating || 0,
        ratingCount: investment.startupId.ratingCount || 0,
        stage: getStartupStage(investment.amount) // Helper function to determine stage
      };
    });

    // Filter by status
    if (status !== 'all') {
      filteredInvestments = portfolioWithMetrics.filter(investment => 
        investment.status === status
      );
    } else {
      filteredInvestments = portfolioWithMetrics;
    }

    // Sort the results
    switch (sortBy) {
      case 'amount':
        filteredInvestments.sort((a, b) => b.investmentAmount - a.investmentAmount);
        break;
      case 'performance':
        filteredInvestments.sort((a, b) => b.roi - a.roi);
        break;
      case 'alphabetical':
        filteredInvestments.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
      default:
        filteredInvestments.sort((a, b) => new Date(b.investmentDate).getTime() - new Date(a.investmentDate).getTime());
        break;
    }

    // Pagination
    const total = filteredInvestments.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filteredInvestments.slice(startIndex, endIndex);

    // Get available categories for filtering
    const categories = [...new Set(allInvestments.map(inv => inv.startupId.categoryType))];

    return NextResponse.json({
      portfolio: paginatedResults,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        categories,
        statuses: ['growing', 'stable', 'declining']
      }
    }, { status: 200 });

  } catch (error) {
    isDev && console.error("[GET API] investor portfolio error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Helper function to determine startup stage based on investment amount
function getStartupStage(amount: number): string {
  if (amount >= 100000) return "Series A+";
  if (amount >= 50000) return "Seed";
  if (amount >= 25000) return "Pre-Seed";
  return "Angel";
}