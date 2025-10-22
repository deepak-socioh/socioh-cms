import { NextResponse } from 'next/server'

// Debug endpoint to check environment variables
// DELETE THIS FILE after debugging is complete!
export async function GET() {
  const envCheck = {
    GOOGLE_CLIENT_ID: {
      exists: !!process.env.GOOGLE_CLIENT_ID,
      length: process.env.GOOGLE_CLIENT_ID?.length || 0,
      preview: process.env.GOOGLE_CLIENT_ID?.substring(0, 15) + '...',
      isUndefined: process.env.GOOGLE_CLIENT_ID === undefined,
      isEmptyString: process.env.GOOGLE_CLIENT_ID === '',
    },
    GOOGLE_CLIENT_SECRET: {
      exists: !!process.env.GOOGLE_CLIENT_SECRET,
      length: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
      preview: process.env.GOOGLE_CLIENT_SECRET?.substring(0, 10) + '...',
      isUndefined: process.env.GOOGLE_CLIENT_SECRET === undefined,
      isEmptyString: process.env.GOOGLE_CLIENT_SECRET === '',
    },
    NEXTAUTH_URL: {
      exists: !!process.env.NEXTAUTH_URL,
      value: process.env.NEXTAUTH_URL, // Safe to show
      isUndefined: process.env.NEXTAUTH_URL === undefined,
      isEmptyString: process.env.NEXTAUTH_URL === '',
    },
    NEXTAUTH_SECRET: {
      exists: !!process.env.NEXTAUTH_SECRET,
      length: process.env.NEXTAUTH_SECRET?.length || 0,
      isUndefined: process.env.NEXTAUTH_SECRET === undefined,
      isEmptyString: process.env.NEXTAUTH_SECRET === '',
    },
    ALLOWED_EMAIL_DOMAIN: {
      exists: !!process.env.ALLOWED_EMAIL_DOMAIN,
      value: process.env.ALLOWED_EMAIL_DOMAIN, // Safe to show
      isUndefined: process.env.ALLOWED_EMAIL_DOMAIN === undefined,
      isEmptyString: process.env.ALLOWED_EMAIL_DOMAIN === '',
    },
    DATABASE_URL: {
      exists: !!process.env.DATABASE_URL,
      length: process.env.DATABASE_URL?.length || 0,
      preview: process.env.DATABASE_URL?.substring(0, 20) + '...',
      isUndefined: process.env.DATABASE_URL === undefined,
      isEmptyString: process.env.DATABASE_URL === '',
    },
  }

  const allGood = Object.values(envCheck).every((check) => check.exists)

  return NextResponse.json(
    {
      status: allGood ? 'OK' : 'MISSING_VARIABLES',
      message: allGood
        ? '✅ All environment variables are loaded correctly!'
        : '❌ Some environment variables are missing or empty',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      variables: envCheck,
      instructions: {
        note: 'DELETE this endpoint (/api/debug/env) after debugging!',
        howToFix: 'Go to Vercel Dashboard → Settings → Environment Variables',
        thenRedeploy: 'After adding variables, redeploy your application',
      },
    },
    {
      status: allGood ? 200 : 500,
    }
  )
}
