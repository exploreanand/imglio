import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongodb';

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Temporarily disable MongoDB adapter until Atlas is set up
  // adapter: MongoDBAdapter(clientPromise),
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
      // If it's a relative URL, make it absolute
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // If it's the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Otherwise redirect to home
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
});
