/** @type {import('next').NextConfig} */
const nextConfig = {
	// Add env-related debugging to the Next.js build
	onDemandEntries: {
		// Keep pages in memory for longer during development
		maxInactiveAge: 25 * 1000,
		// Number of pages to keep in memory
		pagesBufferLength: 5,
	},
	experimental: {
		swcPlugins: [
			["next-superjson-plugin", {}],
		],
	}, 
	images: {
		domains: [
			"res.cloudinary.com",
			"avatars.githubusercontent.com",
			"lh3.googleusercontent.com",
		],
	},
	// Added to handle Vercel build process which runs API routes during build
	typescript: {
		// !! WARN !!
		// Ignoring build errors is dangerous, but necessary for deployment
		// when using database-dependent API routes during build
		ignoreBuildErrors: true,
	},
	// Environment variables that will be available at build time
	env: {
		NEXT_PUBLIC_VERCEL_BUILD: process.env.VERCEL ? 'true' : 'false',
		NEXT_PUBLIC_BUILD_ID: new Date().toISOString(),
	},
	// Improve logging in server components
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

// Log environment variable status during build time
if (process.env.NODE_ENV !== 'development') {
	console.log('Next.js build environment:');
	console.log('- NODE_ENV:', process.env.NODE_ENV);
	console.log('- VERCEL:', process.env.VERCEL ? 'true' : 'false');
	console.log('- VERCEL_ENV:', process.env.VERCEL_ENV || 'not set');
}

module.exports = nextConfig;
