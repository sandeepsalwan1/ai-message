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

  // Check critical environment variables without exposing their values
  const criticalVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'GITHUB_ID',
    'GITHUB_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'PUSHER_APP_ID',
    'NEXT_PUBLIC_PUSHER_APP_KEY',
    'PUSHER_SECRET',
    'NEXT_PUBLIC_PUSHER_CLUSTER',
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'
  ];

  const envStatus = {};
  
  criticalVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      envStatus[varName] = { set: false };
    } else {
      // Only share length and first 3 characters for debugging
      envStatus[varName] = { 
        set: true, 
        length: value.length,
        preview: value.substring(0, 3) + '...'
      };
    }
  });

  // Add runtime info
  const runtimeInfo = {
    node: process.version,
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'not set',
    buildTime: typeof window === 'undefined' && (
      process.env.VERCEL_ENV === 'production' || 
      process.env.VERCEL_ENV === 'preview' ||
      process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.NEXT_PUBLIC_VERCEL_BUILD === 'true'
    ),
  };

  return response.status(200).json({
    status: 'ok',
    environment: envStatus,
    runtime: runtimeInfo,
    user: session.user.email,
    timestamp: new Date().toISOString()
  });
} 