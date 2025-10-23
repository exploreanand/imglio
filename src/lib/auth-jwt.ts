import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

// JWT-only configuration for when MongoDB is not available
export const { handlers, auth, signIn, signOut } = NextAuth({
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
    session: async ({ session, token }: { session: any; token: any }) => {
      console.log('JWT Session callback - token:', token);
      if (token?.sub) {
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
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
});
