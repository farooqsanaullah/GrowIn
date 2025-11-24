import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextAuthOptions";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import Rating from "@/lib/models/rating.model";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { rating } = await req.json();
    const startupId = params.id;
    const userId = session.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingRating = await Rating.findOne({ 
      userId, 
      startupId 
    });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      await Rating.create({
        userId,
        startupId,
        rating,
      });
    }

    // Recalculate average rating
    const allRatings = await Rating.find({ startupId });
    const avgRating = 
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    // Update startup with new average
    await Startup.findByIdAndUpdate(startupId, {
      avgRating: avgRating,
      ratingCount: allRatings.length,
    });

    return NextResponse.json({
      success: true,
      avgRating: avgRating,
      ratingCount: allRatings.length,
    });
  } catch (error) {
    console.error("Rating error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}