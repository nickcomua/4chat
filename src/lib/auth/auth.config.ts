import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    pages: {
      signIn: "/auth",
    },
    session: { strategy: "jwt" },
    callbacks: {
      jwt({ token, user, profile }) {
        if (user) {
          token.id = profile?.sub || user.id
        }
        return token
      },
      session({ session, token }) {
        // With database strategy, we get the user object directly
        session.user.id = token.id as string
        return session
      },
    },
  } satisfies NextAuthConfig;