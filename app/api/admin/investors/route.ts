import User from "@/lib/models/user.model";
import { connectDB } from "@/lib/db/connect";
import { success, error } from "@/lib/auth/apiResponses";

export async function GET() {
  try {
    await connectDB();

    const investors = await User.aggregate([
      { $match: { role: "investor" } },
      {
        $lookup: {
          from: "investments",
          localField: "_id",
          foreignField: "investorId",
          as: "investments",
        },
      },
      {
        $addFields: {
          totalInvestments: { $size: "$investments" },
        },
      },
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
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return success("Investors fetched successfully", 200, investors);
  } catch (err) {
    console.error("[API: GET admin/investors] error: ", err);
    return error("Failed to load investors", 500, err);
  }
}
