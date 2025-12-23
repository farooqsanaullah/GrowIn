// hooks/useMessages.ts
import { useState, useEffect, useCallback } from 'react';
import { IMessage } from '@/lib/types/index';

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial messages
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `/api/messages?conversationId=${conversationId}&limit=50`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // Add message to local state (called by Pusher or optimistic updates)
  const addMessage = useCallback((message: IMessage) => {
    setMessages((prev) => {
      // Check if message already exists by ID
      const exists = prev.some(m => m._id.toString() === message._id.toString());
      if (exists) {
        console.log('Message already exists, skipping:', message._id);
        return prev;
      }
      
      console.log('Adding new message to state:', message._id);
      return [...prev, message];
    });
  }, []);

  // Send message - returns the created message for optimistic update handling
  const sendMessage = useCallback(
    async (content: string): Promise<IMessage | null> => {
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId,
            content,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to send message');
        }

        const data = await response.json();
        const newMessage = data.message;

        // DON'T add the message here - it will come via Pusher
        // OR it was already added optimistically in the component
        
        return newMessage;
      } catch (err) {
        console.error('Error sending message:', err);
        throw err;
      }
    },
    [conversationId]
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
    addMessage,
  };
}