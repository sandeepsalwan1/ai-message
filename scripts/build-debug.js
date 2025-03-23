/**
 * Build Debug Script
 * 
 * This script runs during build to help debug environment variable issues.
 * It logs information about available environment variables without revealing sensitive data.
 */

console.log('🔍 Build Debug Information');
console.log('========================');
console.log(`Build environment: ${process.env.NODE_ENV || 'not set'}`);
console.log(`Vercel environment: ${process.env.VERCEL_ENV || 'not set'}`);
console.log(`Next.js phase: ${process.env.NEXT_PHASE || 'not set'}`);
console.log('========================');

// Check for critical variables without exposing values
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

console.log('Environment Variable Status:');
criticalVars.forEach(varName => {
  // Only log presence/absence and first few characters for debugging
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: Not set`);
  } else {
    // Show partial value for debugging (first 3 chars + length)
    const preview = value.substring(0, 3) + '...' + `[length: ${value.length}]`;
    console.log(`✅ ${varName}: ${preview}`);
  }
});

// Additional checks for Vercel deployment
if (process.env.VERCEL === '1') {
  console.log('\nVercel-specific configuration:');
  console.log(`Deployment URL: ${process.env.VERCEL_URL || 'not set'}`);
  
  // Check if NEXTAUTH_URL is properly configured
  if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL?.includes(process.env.VERCEL_URL)) {
    console.warn('⚠️ NEXTAUTH_URL may not be correctly configured for this deployment URL');
  }
}

console.log('\n✅ Build debug complete'); 