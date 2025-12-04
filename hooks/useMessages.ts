import { useState, useEffect, useCallback } from 'react';
import { IMessage } from '@/lib/types/index';

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial messages
  useEffect(() => {
    if (!conversationId) return;

    async function fetchMessages() {
      try {
        setLoading(true);
        const res = await fetch(`/api/messages?conversationId=${conversationId}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await res.json();
        setMessages(data.messages || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [conversationId]);

  // Add a new message to the list (used by Pusher)
  const addMessage = useCallback((newMessage: IMessage) => {
    setMessages((prev) => {
      // Check if message already exists to prevent duplicates
      const exists = prev.some(
        (msg) => msg._id.toString() === newMessage._id.toString()
      );
      
      if (exists) return prev;
      
      return [...prev, newMessage];
    });
  }, []);

  // Send a new message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        throw new Error('Message content cannot be empty');
      }

      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId,
            content: content.trim(),
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to send message');
        }

        const data = await res.json();
        
        // Add the message to local state immediately
        if (data.message) {
          addMessage(data.message);
        }

        return data.message;
      } catch (err) {
        throw err;
      }
    },
    [conversationId, addMessage]
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
    addMessage,
  };
}