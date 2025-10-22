'use client'

import { Department } from './DepartmentDashboard'

interface DepartmentListProps {
  departments: Department[]
  onEdit: (department: Department) => void
  onDelete: (id: string) => void
}

export default function DepartmentList({
  departments,
  onEdit,
  onDelete
}: DepartmentListProps) {
  if (departments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500 text-lg">No departments found</p>
        <p className="text-gray-400 text-sm mt-2">
          Create a new department to get started
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {departments.map((department) => (
        <div
          key={department.id}
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {department.logo && (
                  <img
                    src={department.logo}
                    alt={`${department.name} logo`}
                    className="h-12 w-12 object-contain mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {department.name}
                </h3>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {department.head ? (
                <div className="text-sm">
                  <p className="text-gray-500">Department Head</p>
                  <p className="text-gray-900 font-medium">{department.head.name}</p>
                  <p className="text-gray-500 text-xs">{department.head.email}</p>
                </div>
              ) : (
                <div className="text-sm">
                  <p className="text-gray-500">Department Head</p>
                  <p className="text-gray-400 italic">Not assigned</p>
                </div>
              )}

              {department.description && (
                <div className="text-sm mt-3">
                  <p className="text-gray-500">Description</p>
                  <p className="text-gray-700 mt-1 line-clamp-3">
                    {department.description}
                  </p>
                </div>
              )}

              <div className="text-sm mt-3 pt-3 border-t border-gray-200">
                <p className="text-gray-500">
                  {department._count.employees}{' '}
                  {department._count.employees === 1 ? 'Employee' : 'Employees'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => onEdit(department)}
                className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(department.id)}
                className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
