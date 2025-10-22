import { Employee } from './AdminDashboard'

interface EmployeeListProps {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
}

export default function EmployeeList({
  employees,
  onEdit,
  onDelete,
}: EmployeeListProps) {
  if (employees.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No employees found. Add one to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {employees.map((employee) => (
          <li key={employee.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {employee.employeeId}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{employee.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">
                        {employee.phoneNumber || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-sm text-gray-900">{employee.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="text-sm text-gray-900">{employee.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Join Date</p>
                      <p className="text-sm text-gray-900">
                        {new Date(employee.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {employee.user.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => onEdit(employee)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(employee.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
