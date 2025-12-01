import Message from "@/lib/models/message.model";
import Conversation from "@/lib/models/converstaion.model";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextAuthOptions";
import { connectDB } from "@/lib/db/connect";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const conversationId = params.id;

    const conv = await Conversation.findById(conversationId);
    if (!conv) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    const isParticipant = conv.participants.some((p: { user: { toString: () => string; }; }) => p.user.toString() === userId);
    if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Math.min(50, Number(url.searchParams.get("limit") || 25));
    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({ messages: messages.reverse() }, { status: 200 });
  } catch (err: any) {
    console.error("GET messages error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const role = session.user.role;
    const conversationId = params.id;
    const { text } = await req.json();

    if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

    const conv = await Conversation.findById(conversationId);
    if (!conv) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    const participant = conv.participants.find((p: { user: { toString: () => string; }; }) => p.user.toString() === userId);
    if (!participant) return NextResponse.json({ error: "Not a participant" }, { status: 403 });

    if (conv.type === "INVESTOR_FOUNDER" && !conv.firstMessageSent) {
      if (role !== "investor") {
        return NextResponse.json({ error: "Only investor can send first message" }, { status: 403 });
      }
    }

    const message = await Message.create({ conversationId, senderId: userId, text });

    if (!conv.firstMessageSent && role === "investor") {
      conv.firstMessageSent = true;
      conv.initiatedBy = userId;
      await conv.save();
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (err: any) {
    console.error("POST message error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
