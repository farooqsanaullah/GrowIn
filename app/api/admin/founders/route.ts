import User from "@/lib/models/user.model";
import { connectDB } from "@/lib/db/connect";
import { success, error } from "@/lib/auth/apiResponses";

export async function GET() {
  try {
    await connectDB();

    // Fetch all users with role 'founder'
    const founders = await User.aggregate([
      { $match: { role: "founder" } },
      {
        $lookup: {
          from: "startups", // collection name in MongoDB
          localField: "_id",
          foreignField: "founders",
          as: "startups",
        },
      },
      {
        $addFields: {
          totalStartups: { $size: "$startups" },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          userName: 1,
          profileImage: 1,
          city: 1,
          country: 1,
          status: 1,
          skills: 1,
          totalStartups: 1,
        },
      },
      { $sort: { createdAt: -1 } }, // latest founders first
    ]);

    return success("Founders fetched successfully", 200, founders);
  } catch (err) {
    console.error("[API: GET admin/founders] error:", err);
    return error("Failed to fetch founders", 500, err);
  }
}
