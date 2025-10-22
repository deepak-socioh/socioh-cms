import { NextResponse } from 'next/server'

// Debug endpoint to test auth configuration
// DELETE THIS FILE after debugging is complete!
export async function GET() {
  try {
    const authConfig = {
      providers: {
        google: {
          clientIdExists: !!process.env.GOOGLE_CLIENT_ID,
          clientSecretExists: !!process.env.GOOGLE_CLIENT_SECRET,
          clientIdPreview: process.env.GOOGLE_CLIENT_ID
            ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...`
            : 'MISSING',
        },
      },
      nextAuth: {
        urlExists: !!process.env.NEXTAUTH_URL,
        url: process.env.NEXTAUTH_URL || 'MISSING',
        secretExists: !!process.env.NEXTAUTH_SECRET,
        secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
      },
      domain: {
        allowedDomainExists: !!process.env.ALLOWED_EMAIL_DOMAIN,
        allowedDomain: process.env.ALLOWED_EMAIL_DOMAIN || 'MISSING',
      },
    }

    const issues = []

    if (!process.env.GOOGLE_CLIENT_ID) {
      issues.push('❌ GOOGLE_CLIENT_ID is missing or empty')
    } else if (process.env.GOOGLE_CLIENT_ID === 'undefined') {
      issues.push('❌ GOOGLE_CLIENT_ID is literally the string "undefined"')
    }

    if (!process.env.GOOGLE_CLIENT_SECRET) {
      issues.push('❌ GOOGLE_CLIENT_SECRET is missing or empty')
    }

    if (!process.env.NEXTAUTH_URL) {
      issues.push('❌ NEXTAUTH_URL is missing or empty')
    } else if (process.env.NEXTAUTH_URL.includes('localhost')) {
      issues.push('⚠️ NEXTAUTH_URL is set to localhost (should be your Vercel URL)')
    }

    if (!process.env.NEXTAUTH_SECRET) {
      issues.push('❌ NEXTAUTH_SECRET is missing or empty')
    } else if (process.env.NEXTAUTH_SECRET.length < 32) {
      issues.push('⚠️ NEXTAUTH_SECRET is too short (should be 32+ characters)')
    }

    if (!process.env.ALLOWED_EMAIL_DOMAIN) {
      issues.push('❌ ALLOWED_EMAIL_DOMAIN is missing or empty')
    }

    return NextResponse.json({
      status: issues.length === 0 ? 'OK' : 'ISSUES_FOUND',
      message:
        issues.length === 0
          ? '✅ All auth configuration looks good!'
          : '❌ Found configuration issues',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      config: authConfig,
      issues: issues.length > 0 ? issues : ['No issues found'],
      nextSteps:
        issues.length > 0
          ? [
              '1. Go to Vercel Dashboard → Settings → Environment Variables',
              '2. Verify all variables are set correctly (no quotes!)',
              '3. Make sure all 3 environments (Production, Preview, Development) are checked',
              '4. Redeploy your application',
            ]
          : ['Configuration looks good! Try signing in again.'],
      warning: 'DELETE /api/debug/auth endpoint after debugging!',
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'Failed to check auth configuration',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
