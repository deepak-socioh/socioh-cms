import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'

export default async function UsersPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      employee: {
        select: {
          id: true,
          employeeId: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <DashboardLayout>
      <div className="w-full p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage system users and their access levels
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {allUsers.map((user) => (
              <li key={user.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name || 'No name'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.role}
                        </span>
                        {user.employee ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Employee: {user.employee.employeeId}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            No employee record
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Joined: {new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
