import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

// Check if MongoDB is available and try to initialize adapter
let mongoAdapter: any = null;
let useDatabaseStrategy = false;

// Only try to initialize MongoDB adapter if MONGODB_URI is available
if (process.env.MONGODB_URI) {
  try {
    const { MongoDBAdapter } = require('@auth/mongodb-adapter');
    const clientPromise = require('./mongodb').default;
    mongoAdapter = MongoDBAdapter(clientPromise);
    useDatabaseStrategy = true;
    console.log('MongoDB adapter initialized successfully');
  } catch (error) {
    console.error('Failed to initialize MongoDB adapter:', error);
    console.log('Falling back to JWT strategy');
    useDatabaseStrategy = false;
  }
} else {
  console.log('MONGODB_URI not found, using JWT strategy');
}

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
      if (user) {
        token.sub = user.id;
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
    strategy: useDatabaseStrategy ? 'database' as const : 'jwt' as const,
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
};

// Add MongoDB adapter if successfully initialized
if (mongoAdapter) {
  (authConfig as any).adapter = mongoAdapter;
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
