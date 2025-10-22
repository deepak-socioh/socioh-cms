'use client'

import { useEffect, useState } from 'react'
import EmployeeForm from './EmployeeForm'
import EmployeeList from './EmployeeList'

export interface Employee {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  dateOfBirth: string | null
  department: string
  position: string
  employeeId: string
  joinDate: string
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  country: string | null
  emergencyContactName: string | null
  emergencyContactPhone: string | null
  emergencyContactRelation: string | null
  user: {
    id: string
    name: string | null
    email: string
    role: 'ADMIN' | 'USER'
  }
}

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return
    }

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchEmployees()
      } else {
        alert('Failed to delete employee')
      }
    } catch (error) {
      console.error('Error deleting employee:', error)
      alert('Error deleting employee')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingEmployee(null)
    fetchEmployees()
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
          <h1 className="text-2xl font-semibold text-gray-900">
            Employee Management
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Employee
          </button>
        </div>

        {showForm && (
          <EmployeeForm
            employee={editingEmployee}
            onClose={handleFormClose}
          />
        )}

        <EmployeeList
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
