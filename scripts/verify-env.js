/**
 * Verify Environment Variables
 * 
 * This script checks for required environment variables.
 * Run it before deployment to ensure all necessary variables are set.
 */

const REQUIRED_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'PUSHER_APP_ID',
  'NEXT_PUBLIC_PUSHER_APP_KEY',
  'PUSHER_SECRET',
  'NEXT_PUBLIC_PUSHER_CLUSTER',
];

// Check optional but recommended vars
const RECOMMENDED_VARS = [
  'GITHUB_ID',
  'GITHUB_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
];

console.log('Verifying environment variables...');

// Check required vars
const missingRequired = REQUIRED_VARS.filter(varName => !process.env[varName]);
if (missingRequired.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingRequired.forEach(varName => console.error(`  - ${varName}`));
  process.exit(1);
}

// Check recommended vars
const missingRecommended = RECOMMENDED_VARS.filter(varName => !process.env[varName]);
if (missingRecommended.length > 0) {
  console.warn('⚠️ Missing recommended environment variables:');
  missingRecommended.forEach(varName => console.warn(`  - ${varName}`));
}

console.log('✅ All required environment variables are set.'); 