import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET - Get current user's employee data only
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get only the current user's employee data
    const employee = await prisma.employee.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    })

    return NextResponse.json(employee ? [employee] : [])
  } catch (error) {
    console.error('Error fetching current user employee data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}