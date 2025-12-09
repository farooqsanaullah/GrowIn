'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher/pusher-client';


interface StartupProfileProps {
  startup: {
    _id: string;
    // name: string;
    description: string;
    founders: Array<{
      _id: string;
      name: string;
      role: string;
    }>;
  };
}

export default function StartupProfile({ startup }: StartupProfileProps) {
  const { data: session } = useSession();
  useEffect(() => {
  if (!session?.user?.id) return;

  // Subscribe to user channel
  const channel = pusherClient.subscribe(`user-${session.user.id}`);

  interface NewConversationPayload {
    conversation: {
      _id: string;
      participants: Array<{
        _id: string;
        role: string;
      }>;
    };
  }

  channel.bind("new-conversation", (payload: NewConversationPayload) => {
    console.log("🚀 New conversation received:", payload);

    // Optional: automatically redirect founder to chat
    // router.push(`/messages/${payload.conversation._id}`);

    // Optional UI alert
    alert(`New conversation created with investor/founder`);
  });

  return () => {
    pusherClient.unsubscribe(`user-${session.user.id}`);
  };
}, [session?.user?.id]);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartConversation = async () => {
    if (!session?.user) {
      alert('Please log in to message this startup');
      return;
    }

    // Only investors can initiate conversations
    if (session.user.role !== 'investor') {
      alert('Only investors can start conversations');
      return;
    }

    setLoading(true);

    try {
      // Get the first founder (you can let user choose which founder)
      const firstFounder = startup.founders[0];

      if (!firstFounder) {
        alert('No founders available for this startup');
        return;
      }

      // Create or get existing conversation
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: firstFounder._id,
          recipientRole: 'founder',
          startupId: startup._id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start conversation');
      }

      const data = await response.json();
      console.log('Conversation started:', data);
      
      // Redirect to the chat page
      router.push(`/messages/${data.conversation._id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert(error instanceof Error ? error.message : 'Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* <h1 className="text-3xl font-bold mb-4">{startup.name}</h1> */}
        <p className="text-gray-600 mb-6">{startup.description}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Founders</h2>
          <div className="space-y-2">
            {startup.founders.map((founder) => (
              <div key={founder._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {founder.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium">{founder.name}</p>
                  <p className="text-sm text-gray-500">{founder.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Button - Only shown to investors */}
        {session?.user?.role === 'investor' && (
          <button
            onClick={handleStartConversation}
            disabled={loading}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? 'Starting conversation...' : 'Message this Startup'}
          </button>
        )}

        {/* Show different message for founders */}
        {session?.user?.role === 'founder' && (
          <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
            Only investors can initiate conversations
          </div>
        )}
      </div>
    </div>
  );
}