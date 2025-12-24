import PusherClient from 'pusher-js';

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

if (!pusherKey || !pusherCluster) {
  throw new Error(
    'Missing Pusher public environment variables. Please set NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER.'
  );
}

export const pusherClient = new PusherClient(pusherKey, {
  cluster: pusherCluster,
  authEndpoint: '/api/pusher/auth',
  auth: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});