import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Conversation from '@/lib/models/converstaion.model';
import Message from '@/lib/models/message.model';
import { getCurrentUser } from '@/lib/auth/session';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const user = await getCurrentUser();

    await connectDB();

    const { id } = params;
    console.log('Fetching conversations for id:', id);

    if (!id) {
      return NextResponse.json({ error: 'id missing' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const startupObjectId = new mongoose.Types.ObjectId(id);

    console.log('Looking for conversations with startupObjectId:', startupObjectId);
    
    if (process.env.NODE_ENV === 'development') {
      const allConversations = await Conversation.find({}).limit(5).lean();
      console.log('Sample conversations:', allConversations);
    }

    const conversations = await Conversation.find({
      startupId: startupObjectId, 
      isTeamChat: false,
    })
      .populate('participants.userId', 'name email avatar image role')
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log('Found conversations:', conversations.length);

    const totalCount = await Conversation.countDocuments({
      startupId: startupObjectId, 
      isTeamChat: false,
    });

    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv) => {
        const messages = await Message.find({ conversationId: conv._id })
          .populate('senderId', 'userName email avatar image role')
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();

        const messagesWithContent = messages
          .map((msg) => ({ ...msg, content: msg.text }))
          .reverse();

        const messageCount = await Message.countDocuments({
          conversationId: conv._id,
        });

        return { ...conv, messages: messagesWithContent, messageCount };
      })
    );
    console.log('Conversations with messages prepared', conversationsWithMessages.length);

    return NextResponse.json({
      success: true,
      conversations: conversationsWithMessages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching startup conversations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}