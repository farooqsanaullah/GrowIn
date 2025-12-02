import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/db/connect";
import Conversation from '@/lib/models/converstaion.model';
import { getCurrentUser, canInitiateConversation } from '@/lib/auth/session';
import { CreateConversationRequest, IConversation } from '@/lib/types/index';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const conversations = await Conversation.find({
      'participants.userId': user.id,
      'metadata.isArchived': false,
    })
      .sort({ 'lastMessage.sentAt': -1 })
      .populate('participants.userId', 'name email avatar')
      .limit(50)
      .lean<IConversation[]>();

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse JSON properly
    const body: CreateConversationRequest = await request.json();
    const { recipientId, recipientRole, startupId } = body;

    if (!recipientId || !recipientRole || !startupId) {
      return NextResponse.json(
        { error: 'recipientId, recipientRole, and startupId are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Validate conversation initiation rules
    if (!canInitiateConversation(user.role, recipientRole)) {
      return NextResponse.json(
        { error: 'Only investors can initiate conversations with founders' },
        { status: 403 }
      );
    }

    // Convert all string IDs to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(user.id);
    const recipientObjectId = new mongoose.Types.ObjectId(recipientId);
    const startupObjectId = new mongoose.Types.ObjectId(startupId);

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      'participants.userId': { $all: [userObjectId, recipientObjectId] },
      startupId: startupObjectId,
    }).lean<IConversation>();

    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation });
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants: [
        { userId: userObjectId, role: user.role },
        { userId: recipientObjectId, role: recipientRole },
      ],
      createdBy: userObjectId,
      startupId: startupObjectId,
      isTeamChat: false,
      lastMessage: '',
      lastMessageAt: new Date(),
      createdAt: new Date(),
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
