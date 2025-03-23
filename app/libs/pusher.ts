import PusherServer from "pusher";
import PusherClient from "pusher-js";
import { isBuildTime } from "./db-build-helper";

// Fallback values for build time
const defaultCluster = 'us2';
const defaultAppId = 'build-app-id';
const defaultAppKey = 'build-app-key';
const defaultSecret = 'build-secret';

// Create a mock Pusher server instance during build
class MockPusherServer {
  authorizeChannel() {
    console.warn('Mock PusherServer: authorizeChannel not available during build');
    return {};
  }

  async trigger() {
    console.warn('Mock PusherServer: trigger not available during build');
    return Promise.resolve();
  }
  
  // Add other PusherServer methods as needed
}

// Create Pusher Server instance conditionally
const createPusherServer = () => {
  if (isBuildTime()) {
    console.warn('Using mock PusherServer during build');
    return new MockPusherServer() as unknown as PusherServer;
  }
  
  return new PusherServer({
    appId: process.env.PUSHER_APP_ID || process.env.NEXT_PUBLIC_PUSHER_APP_ID || defaultAppId,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || defaultAppKey,
    secret: process.env.PUSHER_SECRET || defaultSecret,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || defaultCluster,
    useTLS: true,
  });
};

export const pusherServer = createPusherServer();

// Only create Pusher Client in browser context
export const pusherClient = typeof window !== 'undefined'
  ? new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY || defaultAppKey, 
      {
        channelAuthorization: {
          endpoint: "/api/pusher/auth",
          transport: "ajax",
        },
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || defaultCluster,
      }
    )
  : null as unknown as PusherClient; // Cast to PusherClient to maintain type safety
