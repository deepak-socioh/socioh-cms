import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const departmentUpdateSchema = z.object({
  name: z.string().min(1, 'Department name is required').optional(),
  headId: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})

// GET - Get single department by ID (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const department = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        head: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        employees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            employeeId: true,
          },
        },
        _count: {
          select: {
            employees: true,
          },
        },
      },
    })

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(department)
  } catch (error) {
    console.error('Error fetching department:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update department (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = departmentUpdateSchema.parse(body)

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id: params.id },
    })

    if (!existingDepartment) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    // If name is being updated, check if new name already exists
    if (validatedData.name && validatedData.name !== existingDepartment.name) {
      const nameExists = await prisma.department.findUnique({
        where: { name: validatedData.name },
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Department name already exists' },
          { status: 400 }
        )
      }
    }

    // If headId is provided, verify the user exists
    if (validatedData.headId) {
      const headUser = await prisma.user.findUnique({
        where: { id: validatedData.headId },
      })

      if (!headUser) {
        return NextResponse.json(
          { error: 'Head user not found' },
          { status: 400 }
        )
      }
    }

    // Update department
    const department = await prisma.department.update({
      where: { id: params.id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.headId !== undefined && { headId: validatedData.headId }),
        ...(validatedData.logo !== undefined && { logo: validatedData.logo }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
      },
      include: {
        head: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            employees: true,
          },
        },
      },
    })

    return NextResponse.json(department)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating department:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete department (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            employees: true,
          },
        },
      },
    })

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    // Check if department has employees
    if (department._count.employees > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete department with employees',
          details: `This department has ${department._count.employees} employee(s). Please reassign or remove employees before deleting.`
        },
        { status: 400 }
      )
    }

    // Delete department
    await prisma.department.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Department deleted successfully' })
  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
