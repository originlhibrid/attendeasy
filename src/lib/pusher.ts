import Pusher from 'pusher';
import PusherClient from 'pusher-js';

if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
  throw new Error('NEXT_PUBLIC_PUSHER_KEY is not defined');
}

if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('NEXT_PUBLIC_PUSHER_CLUSTER is not defined');
}

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// Enable pusher logging - don't include this in production
PusherClient.logToConsole = true;

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    authEndpoint: '/api/pusher/auth',
    forceTLS: true
  }
);

// Debug connection state changes
pusherClient.connection.bind('state_change', (states: any) => {
  console.log('Pusher connection state changed:', {
    previous: states.previous,
    current: states.current,
  });
});

pusherClient.connection.bind('error', (err: any) => {
  console.error('Pusher connection error:', err);
});

pusherClient.connection.bind('connected', () => {
  console.log('Successfully connected to Pusher');
});