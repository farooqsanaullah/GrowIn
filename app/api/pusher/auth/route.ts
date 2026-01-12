import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/lib/db/connect";
import Conversation from '@/lib/models/converstaion.model';
import { getCurrentUser } from '@/lib/auth/session';
import { pusherServer } from '@/lib/pusher/pusher-server';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.text();
    const params = new URLSearchParams(data);
    const socketId = params.get('socket_id');
    const channelName = params.get('channel_name');

    if (!socketId || !channelName) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const conversationId = channelName.replace('private-conversation-', '');

    await connectDB();

    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.userId': user.id,
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channelName, {
      user_id: user.id,
      user_info: {
        name: user.name,
        role: user.role,
      },
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}