'use client';

import { useEffect, useState, useCallback } from 'react';
import { pusherClient } from '@/lib/pusher/pusher-client';
import { IMessage, PusherMessage } from '@/lib/types/index';
import { Channel } from 'pusher-js';

interface UseMessagesReturn {
  messages: IMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
}

export function useMessages(conversationId: string | null): UseMessagesReturn {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    let channel: Channel;

    // Fetch initial messages
    async function fetchMessages() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/messages?conversationId=${conversationId}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();

    // Subscribe to Pusher channel for real-time updates
    channel = pusherClient.subscribe(`conversation-${conversationId}`);

    channel.bind('new-message', (data: PusherMessage) => {
      setMessages((prev) => {
        // Avoid duplicates
        const exists = prev.some((msg) => msg._id === data.message._id);
        if (exists) return prev;
        return [...prev, data.message];
      });
    });

    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!conversationId) {
        throw new Error('No conversation selected');
      }

      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId, content }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to send message');
        }
      } catch (err) {
        console.error('Error sending message:', err);
        throw err;
      }
    },
    [conversationId]
  );

  return { messages, loading, error, sendMessage };
}