import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/user.model";
import { success, error } from "@/lib/auth/apiResponses";

export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {  
  try {
    await connectDB();
    
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error("Invalid investor ID", 400);
    }
    
    const body = await req.json();
    const { status } = body;

    // Validate status
    if (!["active", "inactive"].includes(status)) {
      return error("Invalid status value", 400);
    }

    const founder = await User.findOneAndUpdate(
      { _id: id, role: "founder" },
      { status },
      { new: true }
    ).select("name userName status");

    if (!founder) {
      return error("Founder not found", 404);
    }

    return success("Founder status updated successfully", 200, founder);
  } catch (err) {
    console.error("[API: PATCH admin/founders/status] error:", err);
    return error("Failed to update founder status", 500, err);
  }
}
