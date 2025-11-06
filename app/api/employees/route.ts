import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  departmentId: z.string().min(1, 'Department is required'),
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
  married: z.boolean().optional(),
  marriageAnniversary: z.string().optional(),
  alternateEmail: z.string().optional(),
  panCardUrl: z.string().optional(),
  bankAccountHolderName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankIFSCCode: z.string().optional(),
  // Allow either userId OR email for creating employees
  userId: z.string().optional(),
  email: z.string().email().optional(),
}).refine((data) => data.userId || data.email, {
  message: "Either userId or email is required",
  path: ["userId"],
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
        orderBy: {
          createdAt: 'desc',
        },
      })
      return NextResponse.json(employees)
    } else {
      // Regular user gets access denied - they should use /api/employees/me for their own data
      // or /api/employees/team for team directory access
      return NextResponse.json({ error: 'Access denied. Use /api/employees/me for your profile or contact admin for team access.' }, { status: 403 })
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
    console.log('=== Employee Creation Request ===')
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    const validatedData = employeeSchema.parse(body)
    console.log('Validated data:', JSON.stringify(validatedData, null, 2))

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

    let userId = validatedData.userId

    // If email is provided instead of userId, handle user creation/lookup
    if (!userId && validatedData.email) {
      // Check if user already exists with this email
      let existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      })

      if (existingUser) {
        // User exists, use their ID
        userId = existingUser.id
        
        // Check if this user already has an employee record
        const existingEmployeeForUser = await prisma.employee.findUnique({
          where: { userId: existingUser.id }
        })
        
        if (existingEmployeeForUser) {
          return NextResponse.json(
            { error: 'Employee record already exists for this user' },
            { status: 400 }
          )
        }
      } else {
        // Create a new user with just the email (they'll complete profile on first login)
        const newUser = await prisma.user.create({
          data: {
            email: validatedData.email,
            name: `${validatedData.firstName} ${validatedData.lastName}`,
            role: 'USER',
          }
        })
        userId = newUser.id
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Could not determine user ID for employee' },
        { status: 400 }
      )
    }

    // Prepare employee data (exclude email from employee creation)
    const { email, ...employeeData } = validatedData

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        ...employeeData,
        userId,
        dateOfBirth: employeeData.dateOfBirth
          ? new Date(employeeData.dateOfBirth)
          : null,
        joinDate: new Date(employeeData.joinDate),
        marriageAnniversary: employeeData.marriageAnniversary
          ? new Date(employeeData.marriageAnniversary)
          : null,
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
