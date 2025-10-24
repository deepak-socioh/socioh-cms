import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()

    const debugInfo = {
      timestamp: new Date().toISOString(),
      session: session || 'No session found',
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set (hidden)' : 'Not set',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set (hidden)' : 'Not set',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set (hidden)' : 'Not set',
        DATABASE_URL: process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set',
        ALLOWED_EMAIL_DOMAIN: process.env.ALLOWED_EMAIL_DOMAIN || 'Not set',
        NODE_ENV: process.env.NODE_ENV,
      },
    }

    return NextResponse.json(debugInfo, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Debug endpoint error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
