import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import User from "@/lib/models/user.model";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import {
  parseQueryParams,
  sanitizeStartupData,
} from "@/lib/utils/validation";

const STATIC_FOUNDER_ID = "673615f87cdf80bbbb5d7cd7";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parseQueryParams(searchParams);

    const query: any = {};

    const categoryType = searchParams.get("categoryType");
    const industry = searchParams.get("industry");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    if (categoryType) query.categoryType = categoryType;
    if (industry) query.industry = industry;
    if (status) query.status = status;
    if (search) {
      query.$text = { $search: search };
    }

    const [startups, total] = await Promise.all([
      Startup.find(query)
        .populate("founders", "userName name profileImage email")
        .populate("investors", "userName name profileImage email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Startup.countDocuments(query),
    ]);

    return successResponse(
      startups,
      "Startups retrieved successfully",
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
      error.message || "Failed to fetch startups",
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const startupData = sanitizeStartupData(body);

    if (!startupData.founders || startupData.founders.length === 0) {
      startupData.founders = [STATIC_FOUNDER_ID];
    }

    if (!startupData.investors) {
      startupData.investors = [];
    }

    if (!startupData.title || !startupData.description) {
      return errorResponse("Title and description are required", 400);
    }

    if (!startupData.categoryType || !startupData.industry) {
      return errorResponse("Category type and industry are required", 400);
    }

    const startup = await Startup.create(startupData);

    const populatedStartup = await Startup.findById(startup._id)
      .populate("founders", "userName name profileImage email")
      .populate("investors", "userName name profileImage email")
      .lean();

    return successResponse(
      populatedStartup,
      "Startup created successfully",
      201
    );
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return errorResponse("Validation failed", 400, error.errors);
    }
    return errorResponse(
      error.message || "Failed to create startup",
      500
    );
  }
}
