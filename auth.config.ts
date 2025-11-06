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

      // Handle employee record linking and creation
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { employee: true }
        })

        // First, check if there's an employee record created with this email but no user linked
        const orphanedEmployee = await prisma.employee.findFirst({
          where: {
            user: {
              email: user.email
            },
            userId: {
              not: null as any
            }
          },
          include: {
            user: true
          }
        })

        if (orphanedEmployee && orphanedEmployee.user && existingUser) {
          // There's already an employee record for this email, just ensure it's linked properly
          console.log('Employee record already exists for:', user.email)
          
          // Update the user's name if it wasn't set properly
          if (!existingUser.name && user.name) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { name: user.name }
            })
            console.log('✅ Updated user name from auth provider')
          }
        } else if (existingUser && !existingUser.employee) {
          // User exists but no employee record - create one
          console.log('Creating employee record for existing user:', user.email)
          
          // Extract first and last name from user.name
          const nameParts = user.name?.split(' ') || ['', '']
          const firstName = nameParts[0] || user.email?.split('@')[0] || ''
          const lastName = nameParts.slice(1).join(' ') || ''
          
          // Find or create a default department
          let defaultDepartment = await prisma.department.findFirst({
            where: { name: 'General' }
          })
          
          if (!defaultDepartment) {
            defaultDepartment = await prisma.department.create({
              data: {
                name: 'General',
                description: 'Default department for new employees',
                isActive: true
              }
            })
          }

          await prisma.employee.create({
            data: {
              userId: existingUser.id,
              firstName,
              lastName,
              departmentId: defaultDepartment.id,
              position: 'Employee',
              employeeId: `EMP-${Date.now()}`,
              joinDate: new Date(),
            }
          })
          
          console.log('✅ Employee record created successfully')
        } else {
          console.log('User already has employee record or no action needed')
        }
      } catch (error) {
        console.error('Error handling employee record:', error)
        // Don't fail sign in if employee handling fails
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
