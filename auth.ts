import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string

        // Fetch user from database to get latest role
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true }
        })

        if (dbUser) {
          session.user.role = dbUser.role
        }
      }
      return session
    },
  },
})
