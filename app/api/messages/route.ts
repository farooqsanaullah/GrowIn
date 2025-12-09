import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/db/connect";
import Conversation from '@/lib/models/converstaion.model';
import Message from '@/lib/models/message.model';
import { getCurrentUser } from '@/lib/auth/session';
import { pusherServer } from '@/lib/pusher/pusher-server';
import { SendMessageRequest, IMessage } from '@/lib/types/index';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SendMessageRequest = await request.json();
    const { conversationId, content } = body;

    if (!conversationId || !content?.trim()) {
      return NextResponse.json({ error: 'conversationId and content required' }, { status: 400 });
    }

    await connectDB();

    // Verify access
    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.userId': user.id,
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 403 }
      );
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      type: "text",
      text: content.trim(),
    });

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: content.trim(),
        sentAt: message.createdAt,
        senderId: user.id,
      },
      lastMessageAt: message.createdAt,
    });

    // Populate sender info
    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "userName email role")
      .lean<IMessage>();

    if (!populatedMessage) {
      return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
    }

    const messageWithContent = {
      ...populatedMessage,
      content: populatedMessage.text,
    };

    // Real-time event
    // FIX: wrap payload in an object with `message`
    console.log("🚀 ~ messageWithContent:", messageWithContent);
    await pusherServer.trigger(
      `private-conversation-${conversationId}`,
      "new-message",
      { message: messageWithContent }
    );

    console.log("🚀 ~ Message sent via Pusher");

    return NextResponse.json({ message: messageWithContent }, { status: 201 });

  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const conversationId = searchParams.get("conversationId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const before = searchParams.get("before");

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId required" }, { status: 400 });
    }

    await connectDB();

    // Verify access
    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.userId': user.id,
    });

    if (!conversation) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Build query
    const query: any = { conversationId };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("senderId", "userName email avatar role")
      .lean<IMessage[]>();

    const formattedMessages = messages.map(msg => ({
      ...msg,
      content: msg.text,
    }));

    return NextResponse.json({
      messages: formattedMessages.reverse(),
    });

  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
