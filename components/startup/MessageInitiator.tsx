'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { usePusherSubscription } from '@/hooks/usePusherSubs';

interface StartupProfileProps {
  startup: {
    _id: string;
    description: string;
    founders: Array<{
      _id: string;
      userName: string;
      role: string;
    }>;
  };
}

export default function StartupProfile({ startup }: StartupProfileProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Subscribe to user channel for new conversation alerts
  // usePusherSubscription({
  //   channelName: `user-${session?.user?.id}`,
  //   eventName: 'new-conversation',
  //   enabled: !!session?.user?.id,
  //   onEvent: (payload: any) => {
  //     console.log('🚀 New conversation received:', payload);
  //     alert('New conversation created with investor/founder');
  //   },
  // });

  const handleStartConversation = async () => {
    if (!session?.user) {
      alert('Please log in to message this startup');
      return;
    }

    if (session.user.role !== 'investor') {
      alert('Only investors can start conversations');
      return;
    }

    setLoading(true);

    try {
      const firstFounder = startup.founders[0];
      if (!firstFounder) {
        alert('No founders available for this startup');
        return;
      }

      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Founders</h2>
          <div className="space-y-2">
            {startup.founders.map((founder) => (
              <div key={founder._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {founder.userName?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium">{founder.userName}</p>
                  <p className="text-sm text-gray-500">{founder.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {session?.user?.role === 'investor' && (
          <button
            onClick={handleStartConversation}
            disabled={loading}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? 'Starting conversation...' : 'Message this Startup'}
          </button>
        )}

        {session?.user?.role === 'founder' && (
          <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
            Only investors can initiate conversations
          </div>
        )}
      </div>
    </div>
  );
}