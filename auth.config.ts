import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        return false
      }

      const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN
      if (allowedDomain && !user.email.endsWith(`@${allowedDomain}`)) {
        return false
      }

      return true
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "USER"
      }
      return session
    },
  },
} satisfies NextAuthConfig
