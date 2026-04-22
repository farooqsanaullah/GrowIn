import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import User from "@/lib/models/user.model";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const founderId = searchParams.get('founderId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!founderId) {
      return errorResponse("Founder ID is required", 400);
    }

    // Get founder's startups
    const startups = await Startup.find({ founderId }).select('_id name updatedAt').lean();
    const startupIds = startups.map((s: any) => s._id.toString());

    // Generate activities based on recent data changes
    const activities = [];

    // Recent startup updates
    const recentStartups = await Startup.find({ founderId })
      .sort({ updatedAt: -1 })
      .limit(3)
      .select('name updatedAt followers ratings')
      .lean();

    for (const startup of recentStartups) {
      const timeDiff = Date.now() - new Date(startup.updatedAt).getTime();
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      
      if (hoursAgo < 24) {
        activities.push({
          id: `update-${startup._id}`,
          type: 'update',
          title: `${startup.name} profile was updated`,
          timestamp: startup.updatedAt,
          timeAgo: hoursAgo < 1 ? 'Less than an hour ago' : `${hoursAgo} hours ago`,
          color: 'blue'
        });
      }

      // Follower milestones
      const followerCount = startup.followers?.length || 0;
      if (followerCount > 0 && followerCount % 50 === 0) {
        activities.push({
          id: `followers-${startup._id}`,
          type: 'milestone',
          title: `${startup.name} reached ${followerCount} followers`,
          timestamp: startup.updatedAt,
          timeAgo: hoursAgo < 1 ? 'Less than an hour ago' : `${hoursAgo} hours ago`,
          color: 'green'
        });
      }

      // Rating activities
      if (startup.ratings && startup.ratings.length > 0) {
        const latestRating = startup.ratings[startup.ratings.length - 1];
        const ratingTimeDiff = Date.now() - new Date(latestRating.createdAt || startup.updatedAt).getTime();
        const ratingHoursAgo = Math.floor(ratingTimeDiff / (1000 * 60 * 60));
        
        if (ratingHoursAgo < 72) {
          activities.push({
            id: `rating-${startup._id}-${latestRating._id}`,
            type: 'rating',
            title: `${startup.name} received a new rating (${latestRating.value}/5)`,
            timestamp: latestRating.createdAt || startup.updatedAt,
            timeAgo: ratingHoursAgo < 1 ? 'Less than an hour ago' : ratingHoursAgo < 24 ? `${ratingHoursAgo} hours ago` : `${Math.floor(ratingHoursAgo/24)} days ago`,
            color: latestRating.value >= 4 ? 'success' : latestRating.value >= 3 ? 'yellow' : 'red'
          });
        }
      }
    }

    // Add some general activities
    activities.push(
      {
        id: 'profile-featured',
        type: 'feature',
        title: 'Profile featured in trending founders',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        timeAgo: '5 hours ago',
        color: 'primary'
      },
      {
        id: 'monthly-report',
        type: 'report',
        title: 'Monthly analytics report generated',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        timeAgo: '1 day ago',
        color: 'purple'
      }
    );

    // Sort activities by timestamp and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return successResponse(sortedActivities, "Activities retrieved successfully");

  } catch (error) {
    console.error("Error fetching activities:", error);
    return errorResponse("Failed to fetch activities", 500);
  }
}