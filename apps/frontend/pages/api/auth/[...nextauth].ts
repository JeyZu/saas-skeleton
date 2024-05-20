import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { Adapter } from 'next-auth/adapters';

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID ?? '',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Custom sign-in logic
      console.log('User signed in:', user);
      return true; // Return true to proceed with sign-in
    },
    async redirect({ url, baseUrl }) {
      // Custom redirect logic
      console.log('Redirect URL:', url);
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async session({ session, token }) {
      // Add custom properties to the session object
      session.accessToken = token;
      return session;
    },
    async jwt({ token, trigger, session, account }) {
      if (account?.provider === 'my-provider') {
        return { ...token, accessToken: account.access_token };
      }
    },
  },
  debug: true,
});
