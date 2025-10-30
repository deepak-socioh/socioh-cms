import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateEmployeeSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  married: z.boolean().optional(),
  marriageAnniversary: z.string().optional(),
  departmentId: z.string().min(1).optional(),
  position: z.string().min(1).optional(),
  employeeId: z.string().min(1).optional(),
  joinDate: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  alternateEmail: z.string().optional(),
  panCardUrl: z.string().optional(),
  bankAccountHolderName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankIFSCCode: z.string().optional(),
})

// Fields that regular users can update
const userEditableFields = [
  'phoneNumber',
  'dateOfBirth',
  'married',
  'marriageAnniversary',
  'joinDate',
  'address',
  'city',
  'state',
  'zipCode',
  'country',
  'emergencyContactName',
  'emergencyContactPhone',
  'emergencyContactRelation',
  'alternateEmail',
  'panCardUrl',
  'bankAccountHolderName',
  'bankAccountNumber',
  'bankIFSCCode',
]

// GET - Get employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
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

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Regular users can only see their own data
    if (session.user.role !== 'ADMIN' && employee.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateEmployeeSchema.parse(body)

    // Check permissions
    const isAdmin = session.user.role === 'ADMIN'
    const isOwnProfile = employee.userId === session.user.id

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Regular users can only update specific fields
    let dataToUpdate: any = {}
    if (!isAdmin) {
      // Filter to only user-editable fields
      Object.keys(validatedData).forEach((key) => {
        if (userEditableFields.includes(key)) {
          dataToUpdate[key] = (validatedData as any)[key]
        }
      })
    } else {
      // Admin can update all fields
      dataToUpdate = validatedData
    }

    // Convert date strings to Date objects
    if (dataToUpdate.dateOfBirth) {
      dataToUpdate.dateOfBirth = new Date(dataToUpdate.dateOfBirth)
    }
    if (dataToUpdate.joinDate) {
      dataToUpdate.joinDate = new Date(dataToUpdate.joinDate)
    }
    if (dataToUpdate.marriageAnniversary) {
      dataToUpdate.marriageAnniversary = new Date(dataToUpdate.marriageAnniversary)
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: params.id },
      data: dataToUpdate,
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

    return NextResponse.json(updatedEmployee)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating employee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete employee (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    await prisma.employee.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Employee deleted successfully' })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
