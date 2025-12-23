'use client';

import { useMessages } from '@/hooks/useMessages';
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IMessage } from '@/lib/types/index';
import { usePusherSubscription } from '@/hooks/usePusherSubs';

interface ChatPageClientProps {
  conversationId: string;
}

export default function ChatPageClient({ conversationId }: ChatPageClientProps) {
  const { data: session } = useSession();
  const { messages, loading, error, sendMessage, addMessage } = useMessages(conversationId);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ SINGLE Pusher subscription for this conversation
  usePusherSubscription({
    channelName: `private-conversation-${conversationId}`,
    eventName: 'new-message',
    enabled: !!conversationId && !!session?.user?.id,
    onEvent: (data: any) => {
      console.log('📨 New message received:', data);
      
      const message = data?.message;
      if (!message || !message.senderId) return;

      // Extract sender ID
      const messageSenderId = typeof message.senderId === 'object'
        ? message.senderId._id?.toString() || message.senderId.id?.toString()
        : message.senderId.toString();

      // Only add if not from current user (avoid duplicates)
      if (messageSenderId !== session?.user?.id) {
        addMessage(message);
      }
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      const sentMessage = await sendMessage(input.trim());
      if (sentMessage) {
        addMessage(sentMessage); // Add optimistically
      }
      setInput('');
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading messages...</p>
        </div>
      </div>
    );
  
  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Oops!</h3>
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-5xl">💬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Start the conversation</h3>
              <p className="text-gray-500">Send a message to begin chatting</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = isOwnMessage(message);
            const senderName = getSenderName(message) || 'Q';
            const showAvatar = index === 0 || !isOwnMessage(messages[index - 1]) || isOwnMessage(messages[index - 1]) !== isOwn;
            
            return (
              <div
                key={message._id.toString()}
                className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-4 duration-300`}
              >
                {/* Avatar */}
                {showAvatar && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-md flex-shrink-0 ${
                      isOwn
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    }`}
                  >
                    {getInitials(senderName)}
                  </div>
                )}
                {!showAvatar && <div className="w-8 flex-shrink-0" />}

                {/* Message Content */}
                <div className={`flex flex-col max-w-xs md:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
                  {showAvatar && (
                    <span className={`text-xs font-medium mb-1 px-1 ${isOwn ? 'text-indigo-700' : 'text-emerald-700'}`}>
                      {senderName}
                    </span>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 shadow-md transition-all hover:shadow-lg ${
                      isOwn
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {message.content || message.text}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-1">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-lg p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full border-2 border-gray-200 rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all text-gray-800 placeholder-gray-400 shadow-sm"
                disabled={sending}
                maxLength={5000}
              />
              <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                {input.length}/5000
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-2xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:hover:shadow-lg flex items-center justify-center min-w-[3rem] group"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}