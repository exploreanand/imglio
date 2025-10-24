import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

// Create NextAuth configuration
const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user, token }: { session: any; user: any; token: any }) => {
      // Use email-based user ID for consistency across sessions
      // This ensures the same user gets the same ID every time they sign in
      let consistentUserId: string;
      
      if (session?.user?.email) {
        // Create a consistent ID from email - this is the most reliable approach
        consistentUserId = `email-${session.user.email}`;
      } else if (token?.sub) {
        // JWT strategy fallback - use token.sub
        consistentUserId = token.sub;
      } else {
        // Last resort fallback
        consistentUserId = `unknown-${Date.now()}`;
      }
      
      session.user.id = consistentUserId;
      return session;
    },
    jwt: async ({ user, token }: { user: any; token: any }) => {
      if (user) {
        // Use email-based ID for consistency
        if (user.email) {
          token.sub = `email-${user.email}`;
        } else {
          token.sub = user.id;
        }
      }
      return token;
    },
    redirect: async ({ url, baseUrl }: { url: string; baseUrl: string }) => {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
