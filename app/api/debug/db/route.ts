import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Debug endpoint to check database auth tables
export async function GET() {
  try {
    // Check User table
    const users = await prisma.user.findMany({
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

    // Check Account table (OAuth connections)
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        userId: true,
        provider: true,
        providerAccountId: true,
        type: true,
      },
      orderBy: {
        id: 'desc'
      },
      take: 5
    })

    // Check Session table
    const sessions = await prisma.session.findMany({
      select: {
        id: true,
        userId: true,
        sessionToken: true,
        expires: true,
      },
      orderBy: {
        id: 'desc'
      },
      take: 5
    })

    // Check if specific user has an account
    let userAccountCheck = null
    if (users.length > 0) {
      userAccountCheck = await prisma.account.findMany({
        where: {
          userId: users[0].id
        }
      })
    }

    return NextResponse.json({
      users: users.map(u => ({
        ...u,
        createdAt: u.createdAt.toISOString()
      })),
      accounts: accounts,
      sessions: sessions.map(s => ({
        ...s,
        expires: s.expires.toISOString(),
        sessionToken: s.sessionToken.substring(0, 20) + '...'
      })),
      userAccountCheck: userAccountCheck,
      counts: {
        users: users.length,
        accounts: accounts.length,
        sessions: sessions.length,
      },
      diagnosis: {
        usersExist: users.length > 0,
        accountsExist: accounts.length > 0,
        sessionsExist: sessions.length > 0,
        issue: accounts.length === 0
          ? '❌ No Account records found! OAuth login is not creating Account records.'
          : sessions.length === 0
          ? '⚠️ Accounts exist but no Sessions. Using JWT strategy, this is normal.'
          : '✅ Users, Accounts, and Sessions all exist'
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
