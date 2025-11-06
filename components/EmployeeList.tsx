import { Employee } from './AdminDashboard'

interface EmployeeListProps {
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

export default function EmployeeList({
  employees,
  onEdit,
  onDelete,
  readOnly = false,
  visibleColumns,
  currentView,
  getDaysUntilBirthday,
  getDaysUntilWorkAnniversary,
  getYearsOfExperience,
}: EmployeeListProps) {
  if (employees.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">No employees found. Add one to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {visibleColumns?.employee && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employee
                </th>
              )}
              {visibleColumns?.contact && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
              )}
              {visibleColumns?.department && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
              )}
              {visibleColumns?.position && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Position
                </th>
              )}
              {visibleColumns?.joinDate && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Join Date
                </th>
              )}
              {visibleColumns?.role && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
              )}
              {visibleColumns?.dateOfBirth && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date of Birth
                </th>
              )}
              {visibleColumns?.married && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Marital Status
                </th>
              )}
              {visibleColumns?.address && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Address
                </th>
              )}
              {visibleColumns?.emergencyContact && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Emergency Contact
                </th>
              )}
              {visibleColumns?.employeeId && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employee ID
                </th>
              )}
              {!readOnly && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {visibleColumns?.employee && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {employee.user.image ? (
                        <img
                          src={employee.user.image}
                          alt={`${employee.firstName} ${employee.lastName}`}
                          className="h-10 w-10 rounded-full object-cover border-2 border-blue-500"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-300 font-medium text-sm">
                            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {employee.firstName} {employee.lastName}
                        </div>
                        {!visibleColumns?.employeeId && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {employee.employeeId}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                )}
                {visibleColumns?.contact && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{employee.user.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {employee.phoneNumber || 'No phone'}
                    </div>
                  </td>
                )}
                {visibleColumns?.department && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{employee.department?.name || 'Not assigned'}</div>
                  </td>
                )}
                {visibleColumns?.position && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{employee.position}</div>
                  </td>
                )}
                {visibleColumns?.joinDate && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <div>
                        {new Date(employee.joinDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      {currentView === 'experience' && getDaysUntilWorkAnniversary && getYearsOfExperience && (
                        <div className="text-xs text-green-600 font-medium">
                          {(() => {
                            const days = getDaysUntilWorkAnniversary(employee.joinDate)
                            const years = getYearsOfExperience(employee.joinDate)
                            if (days === 0) return `🎉 ${years + 1} years today!`
                            if (days === 1) return `🎉 ${years + 1} years tomorrow!`
                            if (days <= 7) return `🎉 ${years + 1} years in ${days} days`
                            if (days <= 30) return `Next: ${years + 1} years in ${days} days`
                            return `Next: ${years + 1} years in ${days} days`
                          })()}
                        </div>
                      )}
                    </div>
                  </td>
                )}
                {visibleColumns?.role && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.user.role === 'ADMIN'
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                          : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      }`}
                    >
                      {employee.user.role}
                    </span>
                  </td>
                )}
                {visibleColumns?.dateOfBirth && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {employee.dateOfBirth ? (
                      <div>
                        <div>
                          {new Date(employee.dateOfBirth).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        {currentView === 'birthday' && getDaysUntilBirthday && (
                          <div className="text-xs text-blue-600 font-medium">
                            {(() => {
                              const days = getDaysUntilBirthday(employee.dateOfBirth)
                              if (days === 0) return '🎂 Today!'
                              if (days === 1) return '🎂 Tomorrow!'
                              if (days && days <= 7) return `🎂 In ${days} days`
                              if (days && days <= 30) return `In ${days} days`
                              return `In ${days} days`
                            })()}
                          </div>
                        )}
                      </div>
                    ) : (
                      'Not provided'
                    )}
                  </td>
                )}
                {visibleColumns?.married && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {employee.married ? 'Married' : 'Single'}
                    {employee.married && employee.marriageAnniversary && (
                      <div className="text-xs text-gray-500">
                        Anniversary: {new Date(employee.marriageAnniversary).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}
                  </td>
                )}
                {visibleColumns?.address && (
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {employee.address && employee.city ? (
                      <div>
                        <div>{employee.address}</div>
                        <div className="text-xs text-gray-500">
                          {employee.city}{employee.state && `, ${employee.state}`} {employee.zipCode}
                        </div>
                        <div className="text-xs text-gray-500">{employee.country}</div>
                      </div>
                    ) : (
                      'Not provided'
                    )}
                  </td>
                )}
                {visibleColumns?.emergencyContact && (
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {employee.emergencyContactName ? (
                      <div>
                        <div>{employee.emergencyContactName}</div>
                        {employee.emergencyContactRelation && (
                          <div className="text-xs text-gray-500">({employee.emergencyContactRelation})</div>
                        )}
                        <div className="text-xs text-gray-500">{employee.emergencyContactPhone}</div>
                      </div>
                    ) : (
                      'Not provided'
                    )}
                  </td>
                )}
                {visibleColumns?.employeeId && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {employee.employeeId}
                  </td>
                )}
                {!readOnly && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit?.(employee)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete?.(employee.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
