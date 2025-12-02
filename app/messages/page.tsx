'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IConversation, IUser } from '@/lib/types/index';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch('/api/conversations');
        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, []);

  const getOtherParticipant = (conversation: IConversation): IUser | null => {
    const participant = conversation.participants.find(
      (p) => typeof p.userId === 'object' && 'name' in p.userId
    );
    
    if (participant && typeof participant.userId === 'object') {
      return participant.userId as IUser;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          No conversations yet
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            
            return (
              <div
                key={conversation._id.toString()}
                onClick={() => router.push(`/messages/${conversation._id}`)}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {otherParticipant?.name || 'Unknown'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {otherParticipant?.role}
                    </p>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <div className="text-xs text-gray-400 ml-4">
                      {new Date(conversation.lastMessage.sentAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}