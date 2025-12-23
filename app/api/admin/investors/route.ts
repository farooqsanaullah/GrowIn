import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/user.model";

export async function GET() {
  try {
    await connectDB();

    const investors = await User.aggregate([
      // Only investors
      {
        $match: {
          role: "investor",
        },
      },

      // Lookup investments
      {
        $lookup: {
          from: "investments",
          localField: "_id",
          foreignField: "investorId",
          as: "investments",
        },
      },

      // Compute total investments
      {
        $addFields: {
          totalInvestments: {
            $size: "$investments",
          },
        },
      },

      // Shape response for admin UI
      {
        $project: {
          name: 1,
          userName: 1,
          profileImage: 1,
          city: 1,
          country: 1,
          status: 1,
          totalInvestments: 1,
        },
      },

      // Optional: sort newest investors first
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: investors,
    });
  } catch (error) {
    console.error("[API: GET admin/investors] error: ", error);
    return NextResponse.json(
      { success: false, message: "Failed to load investors" },
      { status: 500 }
    );
  }
}
