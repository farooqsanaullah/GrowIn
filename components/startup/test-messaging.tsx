'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Startup } from '@/lib/types/startup';

interface TestMessagingProps {
  startup: Startup; // receive from parent
}

export default function TestMessaging({ startup }: TestMessagingProps) {
  const { data: session } = useSession();

  const [results, setResults] = useState<string[]>([]);
  const [recipientId, setRecipientId] = useState('');
  const [conversationId, setConversationId] = useState('');

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Pick first founder automatically
  useEffect(() => {
    if (startup?.founders?.length > 0) {
      const firstFounder = startup.founders[0] as unknown as { _id: string; name?: string };
      setRecipientId(firstFounder._id);
      addResult(`✅ Recipient set to first founder: ${firstFounder.name || 'Unknown Name'}`);
    } else {
      addResult('❌ No founders found for this startup');
    }
  }, [startup]);

  const testCreateConversation = async () => {
    if (!recipientId) {
      addResult('❌ No recipient selected');
      return;
    }

    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          recipientRole: 'founder',
          startupId: startup._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        addResult(`✅ Conversation created: ${data.conversation._id}`);
        setConversationId(data.conversation._id);
      } else {
        addResult(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  const testSendMessage = async () => {
    if (!conversationId) {
      addResult('❌ No conversation selected');
      return;
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          content: `Test message at ${new Date().toISOString()}`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        addResult(`✅ Message sent: ${data.message._id}`);
      } else {
        addResult(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  if (!session) {
    return <div className="p-8">Please sign in to test</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Messaging System Test Dashboard</h1>

      <div className="bg-blue-50 p-4 rounded mb-6">
        <p><strong>Current User:</strong> {session.user?.name}</p>
        <p><strong>Role:</strong> {session.user?.role}</p>
        <p><strong>ID:</strong> {session.user?.id}</p>
        <p><strong>Startup ID:</strong> {startup._id}</p>
        <p><strong>Recipient (first founder):</strong> {recipientId || 'Loading...'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={testCreateConversation}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={!recipientId}
        >
          1. Create Conversation
        </button>

        <button
          onClick={testSendMessage}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          disabled={!conversationId}
        >
          2. Send Message
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Test Results:</h2>
        <button
          onClick={() => setResults([])}
          className="text-sm text-red-600 mb-2"
        >
          Clear Results
        </button>
        <div className="space-y-1 font-mono text-sm">
          {results.map((result, i) => (
            <div key={i}>{result}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
