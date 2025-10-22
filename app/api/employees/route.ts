import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  joinDate: z.string().min(1, 'Join date is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
})

// GET - List all employees (Admin) or own employee data (User)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role === 'ADMIN') {
      // Admin can see all employees
      const employees = await prisma.employee.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      return NextResponse.json(employees)
    } else {
      // Regular user can only see their own data
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
            },
          },
        },
      })
      return NextResponse.json(employee ? [employee] : [])
    }
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new employee (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = employeeSchema.parse(body)

    // Check if employee ID already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: {
        employeeId: validatedData.employeeId,
      },
    })

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee ID already exists' },
        { status: 400 }
      )
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        ...validatedData,
        dateOfBirth: validatedData.dateOfBirth
          ? new Date(validatedData.dateOfBirth)
          : null,
        joinDate: new Date(validatedData.joinDate),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
