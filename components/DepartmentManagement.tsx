'use client'

import { useEffect, useState } from 'react'
import DepartmentBulkImportModal from './DepartmentBulkImportModal'

interface Department {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  _count: {
    employees: number
  }
}

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  })
  const [saving, setSaving] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingDepartment
        ? `/api/departments/${editingDepartment.id}`
        : '/api/departments'
      const method = editingDepartment ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingDepartment(null)
        setFormData({ name: '', description: '', isActive: true })
        fetchDepartments()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save department')
      }
    } catch (error) {
      console.error('Error saving department:', error)
      alert('Error saving department')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      description: department.description || '',
      isActive: department.isActive,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return

    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchDepartments()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete department')
      }
    } catch (error) {
      console.error('Error deleting department:', error)
      alert('Error deleting department')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingDepartment(null)
    setFormData({ name: '', description: '', isActive: true })
  }

  const handleBulkImport = async (departmentNames: string[]) => {
    try {
      const response = await fetch('/api/departments/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ departments: departmentNames }),
      })

      if (response.ok) {
        const result = await response.json()
        let message = `Import completed! Created: ${result.created}, Skipped: ${result.skipped}`
        
        if (result.createdDepartments && result.createdDepartments.length > 0) {
          message += `\n\nCreated: ${result.createdDepartments.join(', ')}`
        }
        
        if (result.skippedDepartments && result.skippedDepartments.length > 0) {
          message += `\n\nSkipped (already exist): ${result.skippedDepartments.join(', ')}`
        }
        
        if (result.errors && result.errors.length > 0) {
          message += `\n\nErrors: ${result.errors.join(', ')}`
        }
        
        alert(message)
        fetchDepartments()
      } else {
        const error = await response.json()
        alert(`Import failed: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error importing departments:', error)
      alert('Error importing departments')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full p-6">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Department Management
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowBulkImport(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Bulk Import
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Department
            </button>
          </div>
        </div>

        {/* Bulk Import Modal */}
        {showBulkImport && (
          <DepartmentBulkImportModal
            isOpen={showBulkImport}
            onClose={() => setShowBulkImport(false)}
            onImport={handleBulkImport}
          />
        )}

        {/* Department Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingDepartment ? 'Edit Department' : 'Add New Department'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                  >
                    {saving ? 'Saving...' : editingDepartment ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Departments Table */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          {departments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No departments found. Add one to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {departments.map((department) => (
                    <tr key={department.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {department.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {department.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {department._count.employees} employees
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            department.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {department.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(department.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(department)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(department.id)}
                            disabled={department._count.employees > 0}
                            className={`font-medium ${
                              department._count.employees > 0
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-900'
                            }`}
                            title={
                              department._count.employees > 0
                                ? 'Cannot delete department with employees'
                                : 'Delete department'
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}