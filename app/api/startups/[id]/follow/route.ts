import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextAuthOptions";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

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

    const startup = await Startup.findById(id);
    if (!startup) {
      return NextResponse.json(
        { success: false, message: "Startup not found" },
        { status: 404 }
      );
    }

    const isAlreadyFollowing = startup.followers.some(
      (fid: any) => fid.toString() === userId.toString()
    );

    let isFollowed = false;

    if (isAlreadyFollowing) {
      // UNFOLLOW
      await Startup.findByIdAndUpdate(id, {
        $pull: { followers: userId },
      });
      isFollowed = false;
    } else {
      // FOLLOW
      await Startup.findByIdAndUpdate(id, {
        $addToSet: { followers: userId },
      });
      isFollowed = true;
    }

    const updatedStartup = await Startup.findById(id);

    return NextResponse.json({
      success: true,
      isFollowed,
      followers: updatedStartup?.followers || [],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
