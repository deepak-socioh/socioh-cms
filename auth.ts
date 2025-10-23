import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = (user as any).role || 'USER'

        // Auto-create employee record if it doesn't exist
        try {
          const existingEmployee = await prisma.employee.findUnique({
            where: { userId: user.id }
          })

          if (!existingEmployee) {
            // Generate a unique employee ID
            const employeeCount = await prisma.employee.count()
            const employeeId = `EMP${(employeeCount + 1).toString().padStart(4, '0')}`

            // Extract name parts from user name or email
            const fullName = user.name || user.email?.split('@')[0] || 'Employee'
            const nameParts = fullName.split(' ')
            const firstName = nameParts[0] || 'First'
            const lastName = nameParts.slice(1).join(' ') || 'Name'

            // Create employee record with defaults
            await prisma.employee.create({
              data: {
                userId: user.id,
                firstName,
                lastName,
                employeeId,
                position: 'Employee',
                joinDate: new Date(),
              }
            })

            console.log(`✅ Auto-created employee record for ${user.email} (ID: ${employeeId})`)
          }
        } catch (error) {
          console.error('Failed to auto-create employee record:', error)
          // Don't fail login if employee creation fails
        }
      }

      // Update session (when session is manually updated)
      if (trigger === 'update') {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true }
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.role = token.role as "ADMIN" | "USER"
      }
      return session
    },
  },
})
