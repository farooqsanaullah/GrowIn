import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import { success, error } from "@/lib/auth/apiResponses";

export async function GET() {
  try {
    await connectDB();

    // Fetch all startups
    const startups = await Startup.find({})
      .select(
        "_id title description founders investors badges categoryType industry ratingCount avgRating equityRange profilePic totalRaised"
      )
      .sort({ createdAt: -1 })
      .lean();

    return success("Startups fetched successfully", 200, startups);
  } catch (err) {
    console.error("[API: GET admin/startups] error:", err);
    return error("Failed to load startups", 500, err);
  }
}
