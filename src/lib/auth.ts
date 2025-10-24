import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

// Check if MongoDB is available and try to initialize adapter
let mongoAdapter: any = null;
let useDatabaseStrategy = false;

// Function to initialize MongoDB adapter
function initializeMongoDBAdapter() {
  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI not found, using JWT strategy');
    return { adapter: null, useDatabase: false };
  }

  try {
    // Use require for now to avoid dynamic import issues
    const { MongoDBAdapter } = require('@auth/mongodb-adapter');
    const clientPromise = require('./mongodb').default;
    const adapter = MongoDBAdapter(clientPromise);
    console.log('MongoDB adapter initialized successfully');
    return { adapter, useDatabase: true };
  } catch (error) {
    console.error('Failed to initialize MongoDB adapter:', error);
    console.log('Falling back to JWT strategy');
    return { adapter: null, useDatabase: false };
  }
}

// Initialize MongoDB adapter
const { adapter, useDatabase } = initializeMongoDBAdapter();
mongoAdapter = adapter;
useDatabaseStrategy = useDatabase;

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
      console.log('🔍 Session Callback Debug:', {
        strategy: useDatabaseStrategy ? 'database' : 'jwt',
        userFromDB: user?.id,
        tokenSub: token?.sub,
        sessionUserId: session?.user?.id,
        userEmail: session?.user?.email
      });
      
      // Use a consistent identifier based on the OAuth provider
      // This ensures the same user gets the same ID regardless of session strategy
      let consistentUserId: string;
      
      if (user?.id) {
        // Database strategy - use the database user ID
        consistentUserId = user.id;
        console.log('✅ Using database user ID:', user.id);
      } else if (session?.user?.email) {
        // Create a consistent ID from email - this is the most reliable approach
        // This ensures the same user gets the same ID across all sessions
        consistentUserId = `email-${session.user.email}`;
        console.log('✅ Using email-based user ID:', consistentUserId);
      } else if (token?.sub) {
        // JWT strategy fallback - use token.sub
        consistentUserId = token.sub;
        console.log('✅ Using JWT token sub:', token.sub);
      } else {
        // Last resort fallback
        consistentUserId = `unknown-${Date.now()}`;
        console.log('⚠️ Using fallback user ID:', consistentUserId);
      }
      
      session.user.id = consistentUserId;
      console.log('🎯 Final session user ID:', session.user.id);
      return session;
    },
    jwt: async ({ user, token }: { user: any; token: any }) => {
      if (user) {
        // Use email-based ID for consistency
        if (user.email) {
          token.sub = `email-${user.email}`;
          console.log('🔑 JWT: Setting token.sub to email-based ID:', token.sub);
        } else {
          token.sub = user.id;
          console.log('🔑 JWT: Setting token.sub to user.id:', token.sub);
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
