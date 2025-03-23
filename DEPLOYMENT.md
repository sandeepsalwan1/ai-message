# Deployment Guide

## Environment Variables

When deploying to Vercel, ensure the following environment variables are set:

### Required Variables
- `DATABASE_URL` - MySQL database connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js authentication
- `NEXTAUTH_URL` - Full URL of your deployed site (e.g., https://www.aimessage.tech)
- `PUSHER_APP_ID` - Pusher app ID
- `NEXT_PUBLIC_PUSHER_APP_KEY` - Pusher public key
- `PUSHER_SECRET` - Pusher secret key
- `NEXT_PUBLIC_PUSHER_CLUSTER` - Pusher cluster (e.g., us2)

### Authentication Providers
- `GITHUB_ID` and `GITHUB_SECRET` - GitHub OAuth credentials
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` - Google OAuth credentials

### Media Storage
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name for image uploads

## Troubleshooting

### Invalid Credentials Error

If you encounter an "Invalid credentials" error after deployment:

1. Check that all environment variables are set correctly in Vercel
2. Ensure your database connection string is correct and the database is accessible
3. Verify that your NextAuth configuration is properly set up
4. Check the Vercel logs for any server-side errors

### Environment Variable Issues

If you see "Maximum call stack size exceeded" errors in your logs:

1. Make sure your `.env.production` file is properly formatted
2. Verify all required environment variables are set in Vercel
3. Try redeploying after clearing the build cache

## Deployment Steps

1. Push your code to GitHub
2. Create a new project in Vercel connected to your repository
3. Set all required environment variables
4. Deploy the project
5. If you encounter issues, check the logs and this guide for troubleshooting 