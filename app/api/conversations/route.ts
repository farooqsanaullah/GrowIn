import { NextRequest, NextResponse } from "next/server";
import Conversation from "@/lib/models/converstaion.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextAuthOptions";
import { connectDB } from "@/lib/db/connect";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const { type, startupId, participants } = await req.json();

    if (!type || !participants || !Array.isArray(participants)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Check if conversation already exists
    const existing = await Conversation.findOne({
      type,
      startupId: startupId || undefined,
      "participants.user": { $all: participants.map(p => p.user) },
    });

    if (existing) return NextResponse.json({ conversation: existing }, { status: 200 });

    const conversation = await Conversation.create({
      type,
      participants,
      startupId: startupId || undefined,
      firstMessageSent: false,
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/conversations error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    const conversations = await Conversation.find({ "participants.user": userId })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/conversations error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
