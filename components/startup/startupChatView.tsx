'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IConversation, IUser } from '@/lib/types/index';
import { MessageSquare, User } from 'lucide-react';

interface StartupChatsViewProps {
  startupId: string;
}

export default function StartupChatsView({ startupId }: StartupChatsViewProps) {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        const res = await fetch(`/api/startups/${startupId}/conversations`);
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch conversations');
        }

        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (err: any) {
        console.error('Error fetching conversations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (startupId) {
      fetchConversations();
    }
  }, [startupId]);

  const getInvestor = (conversation: IConversation): IUser | null => {
    const investorParticipant = conversation.participants.find(
      (p) => p.role === 'investor' && typeof p.userId === 'object'
    );
    
    if (investorParticipant && typeof investorParticipant.userId === 'object') {
      return investorParticipant.userId as IUser;
    }
    
    return null;
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diff = now.getTime() - dateObj.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) {
        return dateObj.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } else if (days === 1) {
        return 'Yesterday';
      } else if (days < 7) {
        return dateObj.toLocaleDateString([], { weekday: 'short' });
      } else {
        return dateObj.toLocaleDateString([], { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading conversations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">
            Investor Messages
          </h2>
          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
            {conversations.length}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          View and respond to messages from interested investors
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No investor messages yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {conversations.map((conversation) => {
            const investor = getInvestor(conversation);
            
            return (
              <div
                key={conversation._id.toString()}
                onClick={() => router.push(`/messages/${conversation._id}`)}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Investor Avatar */}
                  <div className="flex-shrink-0">
                    {investor?.profileImage ? (
                      <img
                        src={investor.profileImage}
                        alt={investor.name || 'Investor'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {investor?.name || 'Unknown Investor'}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex-shrink-0">
                          Investor
                        </span>
                      </div>
                      {conversation.lastMessage?.sentAt && (
                        <div className="text-xs text-gray-400 ml-4 flex-shrink-0">
                          {formatDate(conversation.lastMessage.sentAt)}
                        </div>
                      )}
                    </div>

                    {/* Last Message Preview */}
                    {conversation.lastMessage?.content && (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}

                    {/* Investor Details */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}