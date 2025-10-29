import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateDepartmentSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
})

// GET - Get department by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const department = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { employees: true }
        },
        employees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
          }
        }
      },
    })

    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 })
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

    const department = await prisma.department.findUnique({
      where: { id: params.id },
    })

    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = updateDepartmentSchema.parse(body)

    // Check if department name already exists (excluding current department)
    if (validatedData.name) {
      const existingDepartment = await prisma.department.findFirst({
        where: {
          name: validatedData.name,
          id: { not: params.id }
        },
      })

      if (existingDepartment) {
        return NextResponse.json(
          { error: 'Department name already exists' },
          { status: 400 }
        )
      }
    }

    const updatedDepartment = await prisma.department.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        _count: {
          select: { employees: true }
        }
      },
    })

    return NextResponse.json(updatedDepartment)
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

    const department = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { employees: true }
        }
      }
    })

    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 })
    }

    // Check if department has employees
    if (department._count.employees > 0) {
      return NextResponse.json(
        { error: 'Cannot delete department with existing employees' },
        { status: 400 }
      )
    }

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