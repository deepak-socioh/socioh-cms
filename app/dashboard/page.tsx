import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session.user.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here's what's happening with your workspace today.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      My Profile
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Update your information
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a
                  href="/dashboard/profile"
                  className="font-medium text-blue-700 hover:text-blue-900"
                >
                  View profile
                </a>
              </div>
            </div>
          </div>

          {/* Team Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Team Directory
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Browse team members
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a
                  href="/dashboard/team"
                  className="font-medium text-blue-700 hover:text-blue-900"
                >
                  View team
                </a>
              </div>
            </div>
          </div>

          {/* Admin Actions Card */}
          {session.user.role === 'ADMIN' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Admin Panel
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Manage system
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a
                    href="/dashboard/users"
                    className="font-medium text-blue-700 hover:text-blue-900"
                  >
                    Manage users
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity or Stats */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {session.user.role === 'ADMIN' ? 'Admin' : 'User'}
                </div>
                <div className="text-sm text-gray-500">Your Role</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Active</div>
                <div className="text-sm text-gray-500">Account Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Date().toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">Today's Date</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
