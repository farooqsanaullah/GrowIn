import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import User from "@/lib/models/user.model";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import {
  isValidObjectId,
  parseQueryParams,
} from "@/lib/utils/validation";

interface RouteParams {
  params: Promise<{
    founderId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { founderId } = await params;

    if (!isValidObjectId(founderId)) {
      return errorResponse("Invalid founder ID", 400);
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parseQueryParams(searchParams);

    const [startups, total] = await Promise.all([
      Startup.find({ founders: founderId })
        .populate("founders", "userName name profileImage email")
        .populate("investors", "userName name profileImage email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Startup.countDocuments({ founders: founderId }),
    ]);

    return successResponse(
      startups,
      "Founder's startups retrieved successfully",
      200,
      {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    );
  } catch (error: any) {
    return errorResponse(
      error.message || "Failed to fetch founder's startups",
      500
    );
  }
}
