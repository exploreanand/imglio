import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

// Check if MongoDB is available
const shouldUseMongoDB = !!process.env.MONGODB_URI;

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
      console.log('Session callback - user:', user, 'token:', token);
      // For database strategy, use user.id
      if (user?.id) {
        session.user.id = user.id;
      }
      // For JWT strategy, use token.sub as fallback
      else if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }: { user: any; token: any }) => {
      console.log('JWT callback - user:', user, 'token:', token);
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    redirect: async ({ url, baseUrl }: { url: string; baseUrl: string }) => {
      console.log('Redirect callback - url:', url, 'baseUrl:', baseUrl);
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
    strategy: shouldUseMongoDB ? 'database' : 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};

// Conditionally add MongoDB adapter
if (shouldUseMongoDB) {
  try {
    const { MongoDBAdapter } = require('@auth/mongodb-adapter');
    const clientPromise = require('./mongodb').default;
    (authConfig as any).adapter = MongoDBAdapter(clientPromise);
  } catch (error) {
    console.error('Failed to add MongoDB adapter:', error);
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
