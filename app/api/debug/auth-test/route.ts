import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await auth()
    
    // Get user count
    const userCount = await prisma.user.count()
    
    // Get sample users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
      take: 5,
    })

    const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN
    
    return NextResponse.json({
      status: 'Auth test complete',
      session: {
        exists: !!session,
        user: session?.user || null,
      },
      database: {
        connected: true,
        userCount,
        sampleUsers: users,
      },
      config: {
        allowedDomain,
        nextAuthUrl: process.env.NEXTAUTH_URL,
      },
      googleOAuth: {
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        note: 'Make sure this exact URL is added to Google Cloud Console Authorized redirect URIs',
      },
      troubleshooting: {
        checklist: [
          `1. Verify ${process.env.NEXTAUTH_URL}/api/auth/callback/google is in Google Console`,
          '2. Check if your email domain matches: ' + allowedDomain,
          '3. Clear browser cookies and try again',
          '4. Check browser console for errors during login',
        ],
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Auth test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
