import PusherClient from 'pusher-js';

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

let pusherClient: PusherClient | null = null;

if (pusherKey && pusherCluster) {
  pusherClient = new PusherClient(pusherKey, {
    cluster: pusherCluster,
    authEndpoint: '/api/pusher/auth',
    auth: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
} else {
  console.warn(
    'Pusher not configured: Missing NEXT_PUBLIC_PUSHER_KEY or NEXT_PUBLIC_PUSHER_CLUSTER environment variables.'
  );
}

export { pusherClient };
