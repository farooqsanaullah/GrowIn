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
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // 🔍 DEBUG: Check what field name your Conversation model uses
    console.log('Looking for conversations with startupObjectId:', startupObjectId);
    
    // Try finding ALL conversations first to see what exists
    const allConversations = await Conversation.find({}).limit(5).lean();
    console.log('Sample conversations in DB:', JSON.stringify(allConversations, null, 2));

    // The issue is likely here - what field stores the startup ID?
    // Is it 'id', 'startupId', 'startup', or something else?
    const conversations = await Conversation.find({
      startupId: startupObjectId, // ← Try 'startupId' instead of 'id'
      isTeamChat: false,
    })
      .populate('participants.userId', 'name email avatar image role')
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log('Found conversations:', conversations.length);

    const totalCount = await Conversation.countDocuments({
      startupId: startupObjectId, // ← Change here too
      isTeamChat: false,
    });

    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv) => {
        const messages = await Message.find({ conversationId: conv._id })
          .populate('senderId', 'name email avatar image role')
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