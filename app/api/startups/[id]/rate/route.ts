import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import Review from "@/lib/models/rating.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextAuthOptions";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>; 
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: startupId } = await params; 

  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const { rating } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Invalid rating" },
        { status: 400 }
      );
    }

    const startupObjectId = new mongoose.Types.ObjectId(startupId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const startup = await Startup.findById(startupObjectId);
    if (!startup) {
      return NextResponse.json(
        { success: false, message: "Startup not found" },
        { status: 404 }
      );
    }

    // Upsert user review
    await Review.findOneAndUpdate(
      { startupId: startupObjectId, userId: userObjectId },
      { rating },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Recalculate avgRating and ratingCount
    const stats = await Review.aggregate([
      { $match: { startupId: startupObjectId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    let avgRating = 0;
    let ratingCount = 0;

    if (stats.length > 0) {
      avgRating = stats[0].avgRating;
      ratingCount = stats[0].ratingCount;

      await Startup.findByIdAndUpdate(startupObjectId, { avgRating, ratingCount });
    }

    return NextResponse.json({ success: true, avgRating, ratingCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id: startupId } = await params; // Added await

  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const startupObjectId = new mongoose.Types.ObjectId(startupId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const review = await Review.findOne({
      startupId: startupObjectId,
      userId: userObjectId,
    });

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}