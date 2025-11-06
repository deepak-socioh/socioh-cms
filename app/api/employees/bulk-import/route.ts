import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bulkEmployeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
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
  married: z.boolean().optional(),
  marriageAnniversary: z.string().optional(),
  alternateEmail: z.string().optional(),
  panCardUrl: z.string().optional(),
  bankAccountHolderName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankIFSCCode: z.string().optional(),
  role: z.enum(['ADMIN', 'USER']).optional().default('USER'),
})

const bulkImportSchema = z.object({
  employees: z.array(bulkEmployeeSchema).min(1, 'At least one employee is required'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = bulkImportSchema.parse(body)

    let created = 0
    let updated = 0
    const errors: string[] = []

    // Process each employee
    for (const employeeData of validatedData.employees) {
      try {
        // Check if user exists by email
        let user = await prisma.user.findUnique({
          where: { email: employeeData.email }
        })

        // Check if employee record exists by email
        let existingEmployee = await prisma.employee.findFirst({
          where: {
            user: {
              email: employeeData.email
            }
          },
          include: {
            user: true
          }
        })

        // Find or create department
        let department = await prisma.department.findFirst({
          where: { name: employeeData.department }
        })

        if (!department) {
          // Create department if it doesn't exist
          department = await prisma.department.create({
            data: {
              name: employeeData.department,
              description: `${employeeData.department} department`
            }
          })
        }

        // Prepare employee data for database
        const employeeDbData = {
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          phoneNumber: employeeData.phoneNumber || null,
          dateOfBirth: employeeData.dateOfBirth ? new Date(employeeData.dateOfBirth) : null,
          departmentId: department.id,
          position: employeeData.position,
          employeeId: employeeData.employeeId,
          joinDate: new Date(employeeData.joinDate),
          address: employeeData.address || null,
          city: employeeData.city || null,
          state: employeeData.state || null,
          zipCode: employeeData.zipCode || null,
          country: employeeData.country || null,
          emergencyContactName: employeeData.emergencyContactName || null,
          emergencyContactPhone: employeeData.emergencyContactPhone || null,
          emergencyContactRelation: employeeData.emergencyContactRelation || null,
          married: employeeData.married || false,
          marriageAnniversary: employeeData.marriageAnniversary ? new Date(employeeData.marriageAnniversary) : null,
          alternateEmail: employeeData.alternateEmail || null,
          panCardUrl: employeeData.panCardUrl || null,
          bankAccountHolderName: employeeData.bankAccountHolderName || null,
          bankAccountNumber: employeeData.bankAccountNumber || null,
          bankIFSCCode: employeeData.bankIFSCCode || null,
        }

        if (existingEmployee) {
          // Update existing employee
          await prisma.employee.update({
            where: { id: existingEmployee.id },
            data: employeeDbData
          })

          // Update user info if needed
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                name: `${employeeData.firstName} ${employeeData.lastName}`,
                role: employeeData.role || 'USER'
              }
            })
          }

          updated++
        } else {
          // Create or update user
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: employeeData.email,
                name: `${employeeData.firstName} ${employeeData.lastName}`,
                role: employeeData.role || 'USER',
              }
            })
          } else {
            // Update existing user
            await prisma.user.update({
              where: { id: user.id },
              data: {
                name: `${employeeData.firstName} ${employeeData.lastName}`,
                role: employeeData.role || 'USER'
              }
            })
          }

          // Check if employee ID already exists (for different user)
          const existingEmployeeId = await prisma.employee.findUnique({
            where: { employeeId: employeeData.employeeId }
          })

          if (existingEmployeeId) {
            errors.push(`Employee ID ${employeeData.employeeId} already exists for ${employeeData.email}`)
            continue
          }

          // Create employee
          await prisma.employee.create({
            data: {
              ...employeeDbData,
              userId: user.id,
            }
          })

          created++
        }
      } catch (employeeError) {
        console.error(`Error processing employee ${employeeData.email}:`, employeeError)
        errors.push(`Failed to process ${employeeData.email}: ${employeeError instanceof Error ? employeeError.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      created,
      updated,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error in bulk import:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}