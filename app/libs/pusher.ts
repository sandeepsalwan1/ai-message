import PusherServer from "pusher";
import PusherClient from "pusher-js";
import { isBuildTime } from "./db-build-helper";

// Fallback values for build time
const defaultCluster = 'us2';
const defaultAppId = 'build-app-id';
const defaultAppKey = 'build-app-key';
const defaultSecret = 'build-secret';

// Create a more robust mock Pusher server instance during build
class MockPusherServer {
  authorizeChannel(socketId: string, channel: string, data: any) {
    console.warn('Mock PusherServer: authorizeChannel called during build');
    return { 
      auth: `${defaultAppKey}:mock_auth_signature`, 
      channel_data: JSON.stringify(data || {}) 
    };
  }

  async trigger(channel: string, event: string, data: any) {
    console.warn('Mock PusherServer: trigger not available during build');
    return Promise.resolve();
  }
  
  // Add other PusherServer methods as needed
  async triggerBatch() {
    console.warn('Mock PusherServer: triggerBatch not available during build');
    return Promise.resolve();
  }
  
  createSignedQueryString() {
    console.warn('Mock PusherServer: createSignedQueryString not available during build');
    return '';
  }
}

// Create Pusher Server instance conditionally
const createPusherServer = () => {
  if (isBuildTime()) {
    console.warn('Using mock PusherServer during build');
    return new MockPusherServer() as unknown as PusherServer;
  }
  
  // Get environment variables with fallbacks
  const appId = process.env.PUSHER_APP_ID || process.env.NEXT_PUBLIC_PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || defaultCluster;
  
  // Log configuration (without exposing secret)
  console.log(`Pusher Server Config - AppID: ${appId ? 'Set' : 'NOT SET'}, Key: ${key ? 'Set' : 'NOT SET'}, Secret: ${secret ? 'Set' : 'NOT SET'}, Cluster: ${cluster}`);
  
  if (!appId || !key || !secret) {
    console.error('WARNING: Missing Pusher server environment variables. Using default values which will not work in production.');
  }
  
  return new PusherServer({
    appId: appId || defaultAppId,
    key: key || defaultAppKey,
    secret: secret || defaultSecret,
    cluster: cluster,
    useTLS: true,
  });
};

export const pusherServer = createPusherServer();

// Create Pusher Client conditionally - only in browser context
export const pusherClient = typeof window !== 'undefined'
  ? new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY || defaultAppKey, 
      {
        channelAuthorization: {
          endpoint: "/api/pusher/auth",
          transport: "ajax",
        },
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || defaultCluster,
        forceTLS: true,
      }
    )
  : null as unknown as PusherClient; // Cast to PusherClient to maintain type safety
