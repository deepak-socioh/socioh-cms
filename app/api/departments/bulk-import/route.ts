import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bulkDepartmentSchema = z.object({
  departments: z.array(z.string().min(1, 'Department name cannot be empty')).min(1, 'At least one department is required'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = bulkDepartmentSchema.parse(body)

    let created = 0
    let skipped = 0
    const errors: string[] = []
    const createdDepartments: string[] = []
    const skippedDepartments: string[] = []

    // Process each department name
    for (const departmentName of validatedData.departments) {
      try {
        const trimmedName = departmentName.trim()
        
        if (!trimmedName) {
          errors.push(`Empty department name skipped`)
          continue
        }

        // Check if department already exists
        const existingDepartment = await prisma.department.findUnique({
          where: { name: trimmedName }
        })

        if (existingDepartment) {
          skipped++
          skippedDepartments.push(trimmedName)
          continue
        }

        // Create new department
        await prisma.department.create({
          data: {
            name: trimmedName,
            description: `${trimmedName} department`,
            isActive: true,
          }
        })

        created++
        createdDepartments.push(trimmedName)

      } catch (departmentError) {
        console.error(`Error processing department ${departmentName}:`, departmentError)
        errors.push(`Failed to process "${departmentName}": ${departmentError instanceof Error ? departmentError.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      created,
      skipped,
      createdDepartments,
      skippedDepartments,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error in department bulk import:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}