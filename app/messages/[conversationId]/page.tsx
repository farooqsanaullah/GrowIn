'use client';

import { useMessages } from '@/hooks/useMessages';
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IMessage } from '@/lib/types/index';

interface ChatPageProps {
  params: {
    conversationId: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const { conversationId } = params;
  const { data: session } = useSession();
  const { messages, loading, error, sendMessage } = useMessages(conversationId);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(input);
      setInput('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const isOwnMessage = (message: IMessage): boolean => {
    if (typeof message.senderId === 'object' && message.senderId._id) {
      return message.senderId._id.toString() === session?.user?.id;
    }
    return message.senderId.toString() === session?.user?.id;
  };

  const getSenderName = (message: IMessage): string => {
    if (typeof message.senderId === 'object' && 'name' in message.senderId) {
      return message.senderId.name;
    }
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id.toString()}
              className={`flex ${
                isOwnMessage(message) ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="max-w-xs md:max-w-md">
                <div className="text-xs text-gray-500 mb-1">
                  {getSenderName(message)}
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isOwnMessage(message)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 shadow'
                  }`}
                >
                  {message.content}
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

      {/* Input Form */}
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