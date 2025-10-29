import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

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
      console.log('=== SignIn Callback ===')
      console.log('User email:', user.email)
      console.log('User name:', user.name)

      if (!user.email) {
        console.log('❌ Sign in failed: No email provided')
        return false
      }

      const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN
      console.log('Allowed domain:', allowedDomain)

      if (allowedDomain && allowedDomain !== 'yourcompany.com') {
        const emailDomain = user.email.split('@')[1]
        console.log('Email domain:', emailDomain)

        if (!user.email.endsWith(`@${allowedDomain}`)) {
          console.log(`❌ Sign in failed: Email domain ${emailDomain} does not match allowed domain ${allowedDomain}`)
          return `/auth/error?error=EmailNotAllowed&domain=${emailDomain}`
        }
      }

      // Create employee record if it doesn't exist
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { employee: true }
        })

        if (existingUser && !existingUser.employee) {
          console.log('Creating employee record for:', user.email)
          
          // Extract first and last name from user.name
          const nameParts = user.name?.split(' ') || ['', '']
          const firstName = nameParts[0] || user.email?.split('@')[0] || ''
          const lastName = nameParts.slice(1).join(' ') || ''
          
          await prisma.employee.create({
            data: {
              userId: existingUser.id,
              firstName,
              lastName,
              department: 'General',
              position: 'Employee',
              employeeId: `EMP-${Date.now()}`,
              joinDate: new Date(),
            }
          })
          
          console.log('✅ Employee record created successfully')
        }
      } catch (error) {
        console.error('Error creating employee record:', error)
        // Don't fail sign in if employee creation fails
      }

      console.log('✅ Sign in successful')
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
