import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set (hidden)' : 'NOT SET',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set (hidden)' : 'NOT SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set (hidden)' : 'NOT SET',
    DATABASE_URL: process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET',
    ALLOWED_EMAIL_DOMAIN: process.env.ALLOWED_EMAIL_DOMAIN || 'NOT SET',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? 'Set (hidden)' : 'NOT SET',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? 'Set (hidden)' : 'NOT SET',
    AWS_REGION: process.env.AWS_REGION || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT SET',
  }

  const missingVars = Object.entries(envVars)
    .filter(([key, value]) => value === 'NOT SET')
    .map(([key]) => key)

  return NextResponse.json({
    environment: envVars,
    missingVariables: missingVars,
    allVariablesSet: missingVars.length === 0,
  })
}
