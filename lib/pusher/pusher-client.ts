import PusherClient from 'pusher-js';

if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('Missing Pusher public environment variables');
}

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    authEndpoint: '/api/pusher/auth',
    auth: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }
);