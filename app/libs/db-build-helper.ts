/**
 * Helper to prevent database operations during build time
 * This is used to skip database operations when Next.js is building the app
 * in environments like Vercel where a database might not be available
 */

// Check if we're in a build environment (typically Vercel build process)
export const isBuildTime = () => {
  // During build time, window is undefined
  const isServer = typeof window === 'undefined';
  
  // Check Vercel-specific environment variables safely
  const isVercelBuild = 
    process.env.VERCEL_ENV === 'production' || 
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NEXT_PHASE === 'phase-production-build';
  
  return isServer && isVercelBuild;
};

// This function returns either real data or mock data during build
export const safeFetch = async <T>(
  fetchFn: () => Promise<T>,
  mockData: T
): Promise<T> => {
  // If we're in build time, return mock data
  if (isBuildTime()) {
    console.warn('Running in build mode - returning mock data');
    return mockData;
  }
  
  // Otherwise, perform the actual fetch
  try {
    return await fetchFn();
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}; 