import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongodb';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
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
      // For JWT strategy, use token.sub as user ID
      if (token?.sub) {
        session.user.id = token.sub;
      }
      // For database strategy, use user.id
      else if (user?.id) {
        session.user.id = user.id;
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
      // Always redirect to home page after sign in
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
});
