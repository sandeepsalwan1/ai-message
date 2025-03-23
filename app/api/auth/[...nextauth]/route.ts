import { PrismaAdapter } from "@next-auth/prisma-adapter";
import brcypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import prisma from "@/app/libs/prismadb";
import { isBuildTime } from "@/app/libs/db-build-helper";

// Log environment variables status for debugging (without exposing sensitive data)
const logEnvironmentStatus = () => {
  // Important NextAuth environment variables
  const variables = [
    'NEXTAUTH_URL', 
    'NEXTAUTH_SECRET',
    'GITHUB_ID',
    'GITHUB_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];
  
  console.log('NextAuth Environment Variables Status:');
  variables.forEach(variable => {
    const value = process.env[variable];
    if (!value) {
      console.warn(`⚠️ ${variable} is not set`);
    } else {
      console.log(`✅ ${variable} is set (${value.substring(0, 3)}...)`);
    }
  });
};

// Only log in server context
if (typeof window === 'undefined') {
  logEnvironmentStatus();
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.warn("Auth attempt with missing email or password");
          throw new Error("Invalid credentials");
        }
        
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user?.hashedPassword) {
            console.warn(`User not found or missing password: ${credentials.email}`);
            throw new Error("Invalid credentials");
          }

          const isPasswordCorrect = await brcypt.compare(credentials.password, user.hashedPassword);

          if (!isPasswordCorrect) {
            console.warn(`Invalid password for user: ${credentials.email}`);
            throw new Error("Invalid credentials");
          }

          console.log(`User authenticated successfully: ${credentials.email}`);
          return {
            ...user,
            id: user.id.toString(),
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed. Please try again.");
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/api/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
