import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()

    // Count users
    const userCount = await prisma.user.count()

    // Get users (without sensitive data)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      take: 10,
    })

    // Count other tables
    const employeeCount = await prisma.employee.count()
    const holidayCount = await prisma.holiday.count()

    await prisma.$disconnect()

    return NextResponse.json({
      status: 'Database connected successfully',
      counts: {
        users: userCount,
        employees: employeeCount,
        holidays: holidayCount,
      },
      users: users,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      },
      { status: 500 }
    )
  }
}
