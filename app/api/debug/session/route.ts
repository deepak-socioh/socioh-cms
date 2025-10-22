import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Debug endpoint to check session status
export async function GET() {
  try {
    const session = await auth()

    // Also check database directly
    let dbUsers = null
    try {
      dbUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      })
    } catch (error) {
      dbUsers = { error: error instanceof Error ? error.message : 'Unknown error' }
    }

    return NextResponse.json({
      session: session || null,
      sessionExists: !!session,
      userEmail: session?.user?.email || null,
      userId: session?.user?.id || null,
      userRole: session?.user?.role || null,
      dbUsers: dbUsers,
      timestamp: new Date().toISOString(),
      envCheck: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
