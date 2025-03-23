import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // Only allow GET requests
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Require authentication for security
  // @ts-ignore
  const session = await getServerSession(request, response, authOptions);
  
  if (!session?.user?.email) {
    return response.status(401).json({ error: 'Authentication required' });
  }

  // Check Pusher environment variables without exposing their values
  const pusherVars = [
    'PUSHER_APP_ID',
    'NEXT_PUBLIC_PUSHER_APP_KEY',
    'PUSHER_SECRET',
    'NEXT_PUBLIC_PUSHER_CLUSTER'
  ];

  const pusherStatus = {};
  
  pusherVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      pusherStatus[varName] = { set: false };
    } else {
      // Only share length and first 3 characters for debugging
      pusherStatus[varName] = { 
        set: true, 
        length: value.length,
        preview: value.substring(0, 3) + '...'
      };
    }
  });

  // Return sanitized debug info
  return response.status(200).json({
    status: 'ok',
    pusher: pusherStatus,
    user: session.user.email,
    timestamp: new Date().toISOString()
  });
} 