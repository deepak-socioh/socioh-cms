'use client'

import { useEffect, useState } from 'react'
import DepartmentForm from './DepartmentForm'
import DepartmentList from './DepartmentList'

export interface Department {
  id: string
  name: string
  headId: string | null
  logo: string | null
  description: string | null
  head: {
    id: string
    name: string | null
    email: string
  } | null
  _count: {
    employees: number
  }
  createdAt: string
  updatedAt: string
}

export default function DepartmentDashboard() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      if (response.ok) {
        const data = await response.json()
        setDepartments(data)
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    const department = departments.find(d => d.id === id)

    if (department && department._count.employees > 0) {
      alert(
        `Cannot delete this department. It has ${department._count.employees} employee(s). ` +
        'Please reassign or remove employees before deleting.'
      )
      return
    }

    if (!confirm('Are you sure you want to delete this department?')) {
      return
    }

    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchDepartments()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete department')
      }
    } catch (error) {
      console.error('Error deleting department:', error)
      alert('Error deleting department')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingDepartment(null)
    fetchDepartments()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Department Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage departments, assign heads, and organize your organization
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Department
          </button>
        </div>

        {showForm && (
          <DepartmentForm
            department={editingDepartment}
            onClose={handleFormClose}
          />
        )}

        <DepartmentList
          departments={departments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
