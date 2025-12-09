import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import User from "@/lib/models/user.model";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { isValidObjectId, sanitizeStartupData } from "@/lib/utils/validation";
import Investment from "@/lib/models/investment.model";
import { Types } from "mongoose";

// Define RouteParams type
interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET startup by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid startup ID", 400);
    }

    // Fetch startup
    const startup = await Startup.findById(id)
      .populate("founders", "userName name profileImage email bio")
      .populate("investors", "userName name profileImage email bio")
      .lean();

    if (!startup) {
      return errorResponse("Startup not found", 404);
    }

    // --- Get total invested amount for this startup ---
    const investmentTotal = await Investment.aggregate([
      { $match: { startupId: new Types.ObjectId(id) } },
      { $group: { _id: null, totalRaised: { $sum: "$amount" } } },
    ]);

    const totalRaised =
      investmentTotal.length > 0 ? investmentTotal[0].totalRaised : 0;

    // Attach to response
    const startupWithTotal = {
      ...startup,
      totalRaised,
    };

    return successResponse(
      startupWithTotal,
      "Startup retrieved successfully"
    );

  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch startup", 500);
  }
}


// PUT / update startup by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid startup ID", 400);
    }

    const body = await request.json();
    const updateData = sanitizeStartupData(body);

    // Prevent updating founders directly
    if (updateData.founders !== undefined) {
      delete updateData.founders;
    }

    const startup = await Startup.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
      .populate("founders", "_id userName name profileImage email")
      .populate("investors", "_id userName name profileImage email")
      .lean();

    if (!startup) {
      return errorResponse("Startup not found", 404);
    }

    return successResponse(startup, "Startup updated successfully");
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return errorResponse("Validation failed", 400, error.errors);
    }
    return errorResponse(error.message || "Failed to update startup", 500);
  }
}

// DELETE startup by ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid startup ID", 400);
    }

    const startup = await Startup.findByIdAndDelete(id).lean();

    if (!startup) {
      return errorResponse("Startup not found", 404);
    }

    return successResponse({ id }, "Startup deleted successfully");
  } catch (error: any) {
    return errorResponse(error.message || "Failed to delete startup", 500);
  }
}
