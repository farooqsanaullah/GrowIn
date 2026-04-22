import { useEffect, useRef } from 'react';
import { pusherClient } from '@/lib/pusher/pusher-client';
import type { Channel } from 'pusher-js';

interface UsePusherSubscriptionOptions {
  channelName: string;
  eventName: string;
  onEvent: (data: any) => void;
  enabled?: boolean;
}

export function usePusherSubscription({
  channelName,
  eventName,
  onEvent,
  enabled = true,
}: UsePusherSubscriptionOptions) {
  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    if (!enabled || !channelName || !pusherClient) return;

    console.log(`Subscribing to: ${channelName}`);

    const channel = pusherClient.subscribe(channelName);
    channelRef.current = channel;

    channel.bind(eventName, onEvent);

    channel.bind('pusher:subscription_succeeded', () => {
      console.log(`Connected to: ${channelName}`);
    });

    channel.bind('pusher:subscription_error', (err: any) => {
      console.error(`Subscription error on ${channelName}:`, err);
    });

    return () => {
      console.log(`Unsubscribing from: ${channelName}`);
      channel.unbind_all();
      pusherClient?.unsubscribe(channelName);
    };
  }, [channelName, eventName, enabled]);

  return channelRef;
}