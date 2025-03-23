import { withAuth } from "next-auth/middleware";

// Export middleware configuration with specific pages
export default withAuth({
  pages: {
    signIn: "/",
  },
});

// Matcher ensures middleware only runs on relevant routes
export const config = {
  matcher: [
    "/conversations/:path*",
    "/users/:path*",
    // Exclude auth routes to avoid circular dependencies
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
