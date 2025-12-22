'use client';

import { useMessages } from '@/hooks/useMessages';
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IMessage, IUser } from '@/lib/types/index';
import Pusher from 'pusher-js';

interface ChatPageClientProps {
  conversationId: string;
}

export default function ChatPageClient({ conversationId }: ChatPageClientProps) {
  const { data: session } = useSession();
  const { messages, loading, error, sendMessage, addMessage } = useMessages(conversationId);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<Pusher | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversationId || !session?.user?.id) return;

    console.log('🔌 Setting up Pusher for conversation', conversationId);

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
      auth: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    });

    pusherRef.current = pusher;
    Pusher.logToConsole = true;

    const channelName = `private-conversation-${conversationId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind('pusher:subscription_succeeded', () => {
      console.log('✅ Subscribed to', channelName);
    });

    channel.bind('pusher:subscription_error', (err: any) => {
      console.error('❌ Pusher subscription error', err);
    });

    // Listen for new messages
    channel.bind('new-message', (data: any) => {
      console.log('📨 Pusher event received:', data);

      // Make sure the data has `message` and a valid senderId
      const message = data?.message;
      console.log('🚀 Received message:', message);
      if (!message || !message.senderId) {
        console.error('❌ Invalid message data received:', data);
        return;
      }

      let messageSenderId: string;
      if (typeof message.senderId === 'object') {
        messageSenderId =
          message.senderId._id?.toString() ||
          message.senderId.id?.toString() ||
          '';
      } else {
        messageSenderId = message.senderId.toString();
      }

      // Only add message if not sent by current user
      if (messageSenderId && messageSenderId !== session.user.id) {
        addMessage(message);
      }
    });

    return () => {
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [conversationId, session?.user?.id, addMessage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(input.trim());
      const sentMessage = await sendMessage(input.trim());
      if (sentMessage) {
        addMessage(sentMessage);
      }
      setInput('');
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const isOwnMessage = (message: IMessage) => {
    if (!message.senderId) return false;

    if (typeof message.senderId === 'object') {
      const senderObj = message.senderId as any;
      return (
        senderObj._id?.toString() === session?.user?.id ||
        senderObj.id?.toString() === session?.user?.id
      );
    }
    return message.senderId.toString() === session?.user?.id;
  };

    const getSenderName = (message: IMessage) => {
      if (typeof message.senderId === 'object' && 'userName' in message.senderId) {
        return (message.senderId as IUser).userName;
      }
      return message.senderName || 'Unknown';
    };



  if (loading)
    return <div className="flex items-center justify-center h-screen">Loading messages...</div>;
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id.toString()}
              className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-xs md:max-w-md">
                <div className="text-xs text-gray-500 mb-1">{getSenderName(message)}</div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isOwnMessage(message)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 shadow'
                  }`}
                >
                  {message.content || message.text}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t bg-white p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
            maxLength={5000}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
