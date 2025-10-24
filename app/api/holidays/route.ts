import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all holidays
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const month = searchParams.get('month')

    let whereClause: any = {}

    if (year) {
      const startOfYear = new Date(parseInt(year), 0, 1)
      const endOfYear = new Date(parseInt(year), 11, 31, 23, 59, 59)
      whereClause = {
        startDate: {
          gte: startOfYear,
          lte: endOfYear,
        },
      }
    }

    if (month && year) {
      const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endOfMonth = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
      whereClause = {
        startDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      }
    }

    const holidays = await prisma.holiday.findMany({
      where: whereClause,
      orderBy: {
        startDate: 'asc',
      },
    })

    return NextResponse.json(holidays)
  } catch (error) {
    console.error('Error fetching holidays:', error)
    return NextResponse.json(
      { error: 'Failed to fetch holidays' },
      { status: 500 }
    )
  }
}

// POST - Create a new holiday (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { occasion, startDate, endDate } = body

    if (!occasion || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const holiday = await prisma.holiday.create({
      data: {
        occasion,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdBy: user.id,
      },
    })

    return NextResponse.json(holiday)
  } catch (error) {
    console.error('Error creating holiday:', error)
    return NextResponse.json(
      { error: 'Failed to create holiday' },
      { status: 500 }
    )
  }
}
