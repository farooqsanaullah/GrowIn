import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import { success, error } from "@/lib/auth/apiResponses";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    // Validate status
    const allowedStatuses = ["active", "inactive", "closed"];
    if (!allowedStatuses.includes(status)) {
      return error(
        "Invalid status value. Allowed: active, inactive, closed",
        400
      );
    }

    const startup = await Startup.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("_id title status");

    if (!startup) {
      return error("Startup not found", 404);
    }

    return success("Startup status updated successfully", 200, startup);
  } catch (err) {
    console.error("[API: PATCH admin/startups/status]", err);
    return error("Failed to update startup status", 500, err);
  }
}
