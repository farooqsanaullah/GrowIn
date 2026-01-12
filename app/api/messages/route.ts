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

    console.log('📝 Creating message for conversation:', conversationId);
    console.log('👤 Sender:', user.name, user.id);

    const message = await Message.create({
      conversationId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      type: "text",
      text: content.trim(),
      content: content.trim(), 
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: content.trim(),
        sentAt: message.createdAt,
        senderId: user.id,
      },
      lastMessageAt: message.createdAt,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "userName name email role avatar image")
      .lean<IMessage>();

    if (!populatedMessage) {
      return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
    }

    const messageWithContent = {
      ...populatedMessage,
      content: populatedMessage.text || populatedMessage.content,
    };

    console.log("🚀 Message created:", messageWithContent._id);

    // ✅ CRITICAL: Trigger ALL relevant channels
    const pusherPayload = { 
      message: messageWithContent,
      conversationId: conversationId 
    };

    const pusherPromises = [];

    try {
      console.log('📡 Triggering private-conversation channel:', conversationId);
      pusherPromises.push(
        pusherServer.trigger(
          `private-conversation-${conversationId}`,
          "new-message",
          pusherPayload
        )
      );

      if (conversation.startupId) {
        console.log('📡 Triggering startup channel:', conversation.startupId);
        pusherPromises.push(
          pusherServer.trigger(
            `startup-${conversation.startupId}`,
            "new-message",
            pusherPayload
          )
        );
      }

      const participants = conversation.participants || [];
      for (const participant of participants) {
        const userId = typeof participant.userId === 'object' 
          ? participant.userId._id?.toString() || participant.userId.toString()
          : participant.userId.toString();
        
        if (userId && userId !== user.id) {
          console.log('📡 Triggering user channel for participant:', userId);
          pusherPromises.push(
            pusherServer.trigger(
              `user-${userId}`,
              "new-message",
              pusherPayload
            )
          );
        }
      }

      await Promise.all(pusherPromises);
      console.log("✅ All Pusher channels triggered successfully");

    } catch (pusherError) {
      console.error("Pusher trigger error:", pusherError);
    }

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

    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.userId': user.id,
    });

    if (!conversation) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const query: any = { conversationId };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("senderId", "userName name email avatar image role")
      .lean<IMessage[]>();

    const formattedMessages = messages.map(msg => ({
      ...msg,
      content: msg.text || msg.content,
    }));

    return NextResponse.json({
      messages: formattedMessages.reverse(),
    });

  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}