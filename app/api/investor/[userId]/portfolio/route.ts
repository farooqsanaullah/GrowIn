import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Investment from "@/lib/models/investment.model";
import Startup from "@/lib/models/startup.model";

const isDev = process.env.NODE_ENV === "development";

// GET investor portfolio for specific user
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const { userId } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Build query for investments
    let investmentQuery: any = { investorId: userId };
    
    // Note: Status filtering removed since Investment model doesn't have status field
    // if (status && status !== 'all') {
    //   investmentQuery.status = status;
    // }

    // Get investments with startup details
    const investments = await Investment.find(investmentQuery)
      .populate({
        path: "startupId",
        populate: {
          path: "founders",
          select: "name userName"
        },
        select: "title description categoryType industry status profilePic ratingCount avgRating createdAt followers"
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count for pagination
    const totalInvestments = await Investment.countDocuments(investmentQuery);

    // Transform the data to match the expected format
    const portfolioData = investments.map(investment => ({
      _id: investment._id,
      startupId: investment.startupId._id,
      startup: {
        title: investment.startupId.title,
        description: investment.startupId.description,
        categoryType: investment.startupId.categoryType,
        industry: investment.startupId.industry,
        status: investment.startupId.status,
        profilePic: investment.startupId.profilePic,
        avgRating: investment.startupId.avgRating || 0,
        ratingCount: investment.startupId.ratingCount || 0,
        followers: investment.startupId.followers || 0
      },
      amount: investment.amount,
      equity: investment.equity,
      status: investment.status, 
      investmentDate: investment.createdAt,
      createdAt: investment.createdAt,
      updatedAt: investment.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: portfolioData,
      pagination: {
        total: totalInvestments,
        page,
        limit,
        totalPages: Math.ceil(totalInvestments / limit)
      }
    }, { status: 200 });

  } catch (error) {
    isDev && console.error("[GET API] investor portfolio error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Internal Server Error" 
      },
      { status: 500 }
    );
  }
}