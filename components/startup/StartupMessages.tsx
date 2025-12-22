'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { pusherClient } from '@/lib/pusher/pusher-client';
import type { Channel } from 'pusher-js';

interface UserInfo {
  _id: string;
  userName: string;
  avatar?: string;
  image?: string;
  role?: string;
}

interface Participant {
  userId: UserInfo;
  role: string;
}

interface MessageData {
  _id: string;
  conversationId: string;
  senderId: UserInfo | string;
  senderName?: string;
  text?: string;
  content?: string;
  createdAt: string;
}

interface LastMessage {
  content: string;
  sentAt: string;
  senderId: UserInfo | string;
}

interface ConversationData {
  _id: string;
  participants: Participant[];
  startupId: string;
  isTeamChat: boolean;
  lastMessage?: LastMessage;
  lastMessageAt: string;
  createdAt: string;
}

interface PusherMessageEvent {
  conversationId: string;
  message: MessageData;
}

interface StartupMessagesProps {
  startupId: string;
}

const StartupMessages = ({ startupId }: StartupMessagesProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [loading, setLoading] = useState(true);

  const startupChannelRef = useRef<Channel | null>(null);
  const userChannelRef = useRef<Channel | null>(null);

  useEffect(() => {
    fetchConversations();
  }, [startupId]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const startupChannel = pusherClient.subscribe(`startup-${startupId}`);
    startupChannelRef.current = startupChannel;
    startupChannel.bind('new-message', handleNewMessageEvent);

    const userChannel = pusherClient.subscribe(`user-${session.user.id}`);
    userChannelRef.current = userChannel;

    return () => {
      startupChannel.unbind_all();
      startupChannel.unsubscribe();
      userChannel.unbind_all();
      userChannel.unsubscribe();
    };
  }, [startupId, session?.user?.id]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/startups/${startupId}/conversations`);
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessageEvent = (data: PusherMessageEvent) => {
    const { conversationId, message } = data;

    setConversations(prev => {
      const index = prev.findIndex(c => c._id === conversationId);
      if (index === -1) return prev;

      const updated = [...prev];
      const conv = { ...updated[index] };

      conv.lastMessage = {
        content: message.content || message.text || '',
        sentAt: message.createdAt,
        senderId: message.senderId,
      };
      conv.lastMessageAt = message.createdAt;

      updated.splice(index, 1);
      return [conv, ...updated];
    });

    const senderId =
      typeof message.senderId === 'object'
        ? message.senderId._id
        : message.senderId;

    if (senderId !== session?.user?.id) {
      showNotification(message);
    }
  };

  const showNotification = (message: MessageData) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const sender =
        typeof message.senderId === 'object' ? message.senderId : null;

      new Notification('New Message', {
        body: `${sender?.userName || 'Someone'}: ${
          (message.content || message.text || '').slice(0, 50)
        }...`,
        icon: sender?.avatar || sender?.image || '/default-avatar.png',
      });
    }
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (date?: string) => {
    if (!date) return '';
    const now = new Date();
    const msgDate = new Date(date);

    const diffMins = Math.floor(
      (now.getTime() - msgDate.getTime()) / 60000
    );

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;

    return msgDate.toLocaleDateString();
  };

  const getInvestorInfo = (conv: ConversationData): UserInfo | undefined =>
    conv.participants?.find(p => p.role === 'investor')?.userId;

  if (loading) {
    return <div className="py-12 text-center">Loading conversations...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="w-7 h-7" />
            Investor Messages
          </h2>
          <p className="mt-1 text-blue-100">
            {conversations.length} active conversation
            {conversations.length !== 1 ? 's' : ''}
          </p>
        </div>

        {conversations.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            No messages yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map(conv => {
              const investor = getInvestorInfo(conv);
              const lastMsg = conv.lastMessage;

              return (
                <div
                  key={conv._id}
                  onClick={() =>
                    router.push(`/messages/${conv._id}`)
                  }
                  className="p-5 cursor-pointer hover:bg-gray-100 transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {investor?.userName || 'Unknown Investor'}
                      </h3>
                      {lastMsg?.content && (
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {lastMsg.content}
                        </p>
                      )}
                    </div>

                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(
                        lastMsg?.sentAt || conv.createdAt
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupMessages;
