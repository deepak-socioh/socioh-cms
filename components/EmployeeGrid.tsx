import { Employee } from './AdminDashboard'

interface EmployeeGridProps {
  employees: Employee[]
  onEdit?: (employee: Employee) => void
  onDelete?: (id: string) => void
  readOnly?: boolean
  visibleColumns?: {
    employee: boolean
    contact: boolean
    department: boolean
    position: boolean
    joinDate: boolean
    role: boolean
    dateOfBirth: boolean
    married: boolean
    address: boolean
    emergencyContact: boolean
    employeeId: boolean
  }
  currentView?: string
  getDaysUntilBirthday?: (dateOfBirth: string | null) => number | null
  getDaysUntilWorkAnniversary?: (joinDate: string) => number
  getYearsOfExperience?: (joinDate: string) => number
}

export default function EmployeeGrid({
  employees,
  onEdit,
  onDelete,
  readOnly = false,
  visibleColumns,
  currentView,
  getDaysUntilBirthday,
  getDaysUntilWorkAnniversary,
  getYearsOfExperience,
}: EmployeeGridProps) {
  if (employees.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">No employees found. Add one to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            {/* Profile Section */}
            <div className="text-center mb-4">
              {employee.user.image ? (
                <img
                  src={employee.user.image}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                    {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                  </span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {employee.firstName} {employee.lastName}
              </h3>
              {(visibleColumns?.employee && !visibleColumns?.employeeId) && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {employee.employeeId}
                </span>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-2 text-sm">
              {visibleColumns?.contact && (
                <>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Email:</span>
                    <p className="text-gray-900 dark:text-white truncate">{employee.user.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Phone:</span>
                    <p className="text-gray-900 dark:text-white">{employee.phoneNumber || 'N/A'}</p>
                  </div>
                </>
              )}
              {visibleColumns?.department && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Department:</span>
                  <p className="text-gray-900 dark:text-white">{employee.department?.name || 'Not assigned'}</p>
                </div>
              )}
              {visibleColumns?.position && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Position:</span>
                  <p className="text-gray-900 dark:text-white">{employee.position}</p>
                </div>
              )}
              {visibleColumns?.joinDate && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Join Date:</span>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(employee.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    {currentView === 'experience' && getDaysUntilWorkAnniversary && getYearsOfExperience && (
                      <span className="block text-xs text-green-600 font-medium mt-1">
                        {(() => {
                          const days = getDaysUntilWorkAnniversary(employee.joinDate)
                          const years = getYearsOfExperience(employee.joinDate)
                          if (days === 0) return `🎉 ${years + 1} years today!`
                          if (days === 1) return `🎉 ${years + 1} years tomorrow!`
                          if (days <= 7) return `🎉 ${years + 1} years in ${days} days`
                          if (days <= 30) return `Next: ${years + 1} years in ${days} days`
                          return `Next: ${years + 1} years in ${days} days`
                        })()}
                      </span>
                    )}
                  </p>
                </div>
              )}
              {visibleColumns?.role && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Role:</span>
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
              )}
              {visibleColumns?.dateOfBirth && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Date of Birth:</span>
                  <p className="text-gray-900 dark:text-white">
                    {employee.dateOfBirth ? (
                      <>
                        {new Date(employee.dateOfBirth).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        {currentView === 'birthday' && getDaysUntilBirthday && (
                          <span className="block text-xs text-blue-600 font-medium mt-1">
                            {(() => {
                              const days = getDaysUntilBirthday(employee.dateOfBirth)
                              if (days === 0) return '🎂 Today!'
                              if (days === 1) return '🎂 Tomorrow!'
                              if (days && days <= 7) return `🎂 In ${days} days`
                              if (days && days <= 30) return `In ${days} days`
                              return `In ${days} days`
                            })()}
                          </span>
                        )}
                      </>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                </div>
              )}
              {visibleColumns?.married && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Marital Status:</span>
                  <p className="text-gray-900 dark:text-white">
                    {employee.married ? 'Married' : 'Single'}
                    {employee.married && employee.marriageAnniversary && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">
                        Anniversary: {new Date(employee.marriageAnniversary).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    )}
                  </p>
                </div>
              )}
              {visibleColumns?.address && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Address:</span>
                  <p className="text-gray-900 dark:text-white">
                    {employee.address && employee.city ? (
                      <>
                        <span>{employee.address}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">
                          {employee.city}{employee.state && `, ${employee.state}`} {employee.zipCode}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">{employee.country}</span>
                      </>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                </div>
              )}
              {visibleColumns?.emergencyContact && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Emergency Contact:</span>
                  <p className="text-gray-900 dark:text-white">
                    {employee.emergencyContactName ? (
                      <>
                        <span>{employee.emergencyContactName}</span>
                        {employee.emergencyContactRelation && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 block">({employee.emergencyContactRelation})</span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">{employee.emergencyContactPhone}</span>
                      </>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                </div>
              )}
              {visibleColumns?.employeeId && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Employee ID:</span>
                  <p className="text-gray-900 dark:text-white">{employee.employeeId}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!readOnly && (
              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => onEdit?.(employee)}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(employee.id)}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}