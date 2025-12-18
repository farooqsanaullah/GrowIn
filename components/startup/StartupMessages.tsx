'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Clock, ChevronDown, Send } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/lib/pusher/pusher-client';
import type { Channel } from 'pusher-js';

interface UserInfo {
  _id: string;
  name: string;
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
  senderRole?: string;
  type?: string;
  createdAt: string;
  readBy?: string[];
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
  messages?: MessageData[];
  messageCount?: number;
}

interface PusherMessageEvent {
  conversationId: string;
  message: MessageData;
  conversation?: ConversationData;
}

interface StartupMessagesProps {
  startupId: string;
}

const StartupMessages = ({ startupId }: StartupMessagesProps) => {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedConvs, setExpandedConvs] = useState<Set<string>>(new Set());
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [sendingMessages, setSendingMessages] = useState<Set<string>>(new Set());
  const startupChannelRef = useRef<Channel | null>(null);
  const userChannelRef = useRef<Channel | null>(null);
  const messagesEndRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
    userChannel.bind('new-conversation', handleNewConversationEvent);

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
      if (index !== -1) {
        const updated = [...prev];
        const conv = { ...updated[index] };

        conv.lastMessage = {
          content: message.content || message.text || '',
          sentAt: message.createdAt,
          senderId: message.senderId,
        };
        conv.lastMessageAt = message.createdAt;

        conv.messages = conv.messages ? [...conv.messages, message] : [message];
        conv.messageCount = (conv.messageCount || 0) + 1;

        updated.splice(index, 1);
        setTimeout(() => scrollToBottom(conv._id), 50);
        return [conv, ...updated];
      }
      return prev;
    });

    // Only show notification for messages from others
    const messageSenderId = typeof message.senderId === 'object' 
      ? message.senderId._id 
      : message.senderId;
    
    if (messageSenderId !== session?.user?.id) {
      showNotification(message);
    }
  };

  const handleNewConversationEvent = (data: { conversation: ConversationData }) => {
    setConversations(prev => {
      const exists = prev.some(c => c._id === data.conversation._id);
      if (exists) return prev;
      return [data.conversation, ...prev];
    });
  };

  const showNotification = (message: MessageData) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const sender =
        typeof message.senderId === 'object' ? message.senderId : null;
      const senderName = sender?.name || message.senderName || 'Someone';
      const content = message.content || message.text || '';

      new Notification('New Message', {
        body: `${senderName}: ${content.substring(0, 50)}...`,
        icon: sender?.avatar || sender?.image || '/default-avatar.png',
      });
    }
  };

  const toggleExpanded = (convId: string) => {
    setExpandedConvs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(convId)) newSet.delete(convId);
      else newSet.add(convId);
      setTimeout(() => scrollToBottom(convId), 50);
      return newSet;
    });
  };

  const scrollToBottom = (convId: string) => {
    const ref = messagesEndRefs.current[convId];
    if (ref) ref.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (conversationId: string) => {
    const messageText = replyTexts[conversationId]?.trim();
    if (!messageText || !session?.user?.id) return;

    setSendingMessages(prev => new Set(prev).add(conversationId));

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          content: messageText,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      // Clear the input field
      setReplyTexts(prev => ({
        ...prev,
        [conversationId]: '',
      }));

      // Scroll to bottom after sending
      setTimeout(() => scrollToBottom(conversationId), 100);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setSendingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(conversationId);
        return newSet;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, conversationId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(conversationId);
    }
  };

  const formatTime = (date: string | Date | undefined) => {
    if (!date) return '';
    const now = new Date();
    const msgDate = new Date(date);

    const diffMs = now.getTime() - msgDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return msgDate.toLocaleDateString();
  };

  const getInvestorInfo = (conv: ConversationData): UserInfo | undefined =>
    conv.participants?.find(p => p.role === 'investor')?.userId;

  const getMessageSenderClass = (
    senderId: UserInfo | string | undefined,
    investor: UserInfo | undefined
  ) => {
    if (!senderId || !investor) return 'bg-gray-100';
    const senderIdStr =
      typeof senderId === 'object' ? senderId._id : senderId;
    return senderIdStr === investor._id
      ? 'bg-blue-50 border-l-4 border-blue-400'
      : 'bg-purple-50 border-l-4 border-purple-400';
  };

  if (loading)
    return <div className="py-12 text-center">Loading conversations...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="w-7 h-7" /> Investor Messages
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
              const isExpanded = expandedConvs.has(conv._id);
              const isSending = sendingMessages.has(conv._id);

              return (
                <div
                  key={conv._id}
                  className="transition-all duration-200 hover:bg-gray-50"
                >
                  <div className="p-5 flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {investor?.name || 'Unknown'}
                      </h3>
                      {lastMsg?.content && (
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {lastMsg.content}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {formatTime(lastMsg?.sentAt || conv.createdAt)}
                      </span>
                      <button
                        onClick={() => toggleExpanded(conv._id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 bg-gray-50">
                      {/* Messages */}
                      {conv.messages && (
                        <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                          {conv.messages.map(msg => {
                            const sender =
                              typeof msg.senderId === 'object'
                                ? msg.senderId
                                : null;

                            return (
                              <div
                                key={msg._id}
                                className={`rounded-lg p-3 ${getMessageSenderClass(
                                  msg.senderId,
                                  investor
                                )}`}
                              >
                                <div className="flex justify-between mb-1">
                                  <span className="font-semibold text-sm">
                                    {sender?.name ||
                                      msg.senderName ||
                                      'Unknown'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatTime(msg.createdAt)}
                                  </span>
                                </div>

                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {msg.text || msg.content}
                                </p>
                              </div>
                            );
                          })}
                          <div
                            ref={el => {
                              messagesEndRefs.current[conv._id] = el;
                            }}
                          />
                        </div>
                      )}

                      {/* Reply Input */}
                      <div className="flex gap-2 items-end">
                        <textarea
                          value={replyTexts[conv._id] || ''}
                          onChange={e =>
                            setReplyTexts(prev => ({
                              ...prev,
                              [conv._id]: e.target.value,
                            }))
                          }
                          onKeyPress={e => handleKeyPress(e, conv._id)}
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={2}
                          disabled={isSending}
                        />
                        <button
                          onClick={() => handleSendMessage(conv._id)}
                          disabled={
                            isSending ||
                            !replyTexts[conv._id]?.trim()
                          }
                          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                          <Send className="w-5 h-5" />
                          {isSending ? 'Sending...' : 'Send'}
                        </button>
                      </div>
                    </div>
                  )}
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