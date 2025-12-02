import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/user.model";
import Investment from "@/lib/models/investment.model";
import { parseQueryParams } from "@/lib/utils/validation";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

const isDev = process.env.NODE_ENV === "development";

// GET all investors with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || 'all';
    const country = searchParams.get('country') || 'all';
    const minFunding = searchParams.get('minFunding');
    const maxFunding = searchParams.get('maxFunding');
    const isVerified = searchParams.get('isVerified');
    const sortBy = searchParams.get('sortBy') || 'recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Build query for investors
    let query: any = { role: 'investor' };

    // Search by name, userName, or bio
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by location
    if (city !== 'all') {
      query.city = { $regex: city, $options: 'i' };
    }

    if (country !== 'all') {
      query.country = { $regex: country, $options: 'i' };
    }

    // Filter by funding range
    if (minFunding || maxFunding) {
      const fundingFilter: any = {};
      if (minFunding) fundingFilter.$gte = parseInt(minFunding);
      if (maxFunding) fundingFilter.$lte = parseInt(maxFunding);
      
      if (minFunding) {
        query['fundingRange.min'] = { $lte: parseInt(minFunding) };
      }
      if (maxFunding) {
        query['fundingRange.max'] = { $gte: parseInt(maxFunding) };
      }
    }

    // Filter by verification status
    if (isVerified && isVerified !== 'all') {
      query.isVerified = isVerified === 'true';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort options
    let sortOptions: any = {};
    switch (sortBy) {
      case 'name':
        sortOptions = { name: 1 };
        break;
      case 'funding_high':
        sortOptions = { 'fundingRange.max': -1 };
        break;
      case 'funding_low':
        sortOptions = { 'fundingRange.min': 1 };
        break;
      case 'verified':
        sortOptions = { isVerified: -1, createdAt: -1 };
        break;
      case 'recent':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Get investors with populated data
    const investors = await User.find(query)
      .select('userName name email profileImage bio city country fundingRange isVerified createdAt socialLinks')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalInvestors = await User.countDocuments(query);

    // Add investment stats for each investor
    const investorsWithStats = await Promise.all(
      investors.map(async (investor) => {
        const investmentStats = await Investment.aggregate([
          { $match: { investorId: investor._id } },
          {
            $group: {
              _id: null,
              totalInvestments: { $sum: 1 },
              totalInvested: { $sum: '$amount' },
              avgInvestment: { $avg: '$amount' }
            }
          }
        ]);

        const stats = investmentStats[0] || {
          totalInvestments: 0,
          totalInvested: 0,
          avgInvestment: 0
        };

        return {
          ...investor,
          investmentStats: {
            totalInvestments: stats.totalInvestments,
            totalInvested: stats.totalInvested,
            avgInvestment: Math.round(stats.avgInvestment || 0)
          }
        };
      })
    );

    // Get unique filter options
    const allInvestors = await User.find({ role: 'investor' }).select('city country fundingRange');
    const cities = [...new Set(allInvestors.map(inv => inv.city).filter(Boolean))].sort();
    const countries = [...new Set(allInvestors.map(inv => inv.country).filter(Boolean))].sort();

    const response = {
      investors: investorsWithStats,
      pagination: {
        page,
        limit,
        total: totalInvestors,
        pages: Math.ceil(totalInvestors / limit),
        hasNext: page < Math.ceil(totalInvestors / limit),
        hasPrev: page > 1
      },
      filters: {
        cities,
        countries,
        fundingRanges: [
          { label: '< $10K', min: 0, max: 10000 },
          { label: '$10K - $50K', min: 10000, max: 50000 },
          { label: '$50K - $100K', min: 50000, max: 100000 },
          { label: '$100K - $500K', min: 100000, max: 500000 },
          { label: '$500K+', min: 500000, max: null }
        ]
      }
    };

    return successResponse(response, "Investors fetched successfully");

  } catch (error) {
    isDev && console.error("[GET API] investors error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}