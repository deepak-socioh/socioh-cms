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
      <div className="w-full p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {session.user.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Here's what's happening with your workspace today.
          </p>
          {/* Theme test indicator */}
          {/* <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 text-sm rounded-lg border border-blue-200 dark:border-blue-700">
            🎨 Theme Test: This card should be light blue in light mode, dark blue in dark mode. 
            Toggle the theme using the sun/moon icon in the header.
          </div> */}
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">👤</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      My Profile
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                      Update your information
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4">
              <div className="text-sm">
                <a
                  href="/dashboard/profile"
                  className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  View profile
                  <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Team Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Team Directory
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                      Browse team members
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4">
              <div className="text-sm">
                <a
                  href="/dashboard/team"
                  className="inline-flex items-center font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                >
                  View team
                  <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Admin Actions Card */}
          {session.user.role === 'ADMIN' && (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">⚙️</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Admin Panel
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                        Manage system
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4">
                <div className="text-sm">
                  <a
                    href="/dashboard/users"
                    className="inline-flex items-center font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                  >
                    Manage users
                    <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Stats Dashboard */}
        {/* <div style="display:none;" className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-6 sm:p-8">
            <h3 className="text-xl leading-6 font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
              Quick Stats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">{session.user.role === 'ADMIN' ? '👑' : '👤'}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {session.user.role === 'ADMIN' ? 'Admin' : 'User'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Your Role</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">✅</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">Active</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Account Status</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📅</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Today's Date</div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Data Visualization Section */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
              Profile Completion
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Personal Info</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">85%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" style={{width: '85%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Details</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">92%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500" style={{width: '92%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">60%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📝</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Profile updated</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">👥</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Team directory accessed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔐</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Login successful</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Weekly Overview Chart */}
        {/* <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
            Weekly Activity Overview
          </h3>
          <div className="grid grid-cols-7 gap-2 h-32">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="flex flex-col items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{day}</div>
                <div className="flex-1 w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg relative">
                  <div 
                    className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-700 delay-${index * 100} ${
                      index === 0 ? 'bg-gradient-to-t from-blue-500 to-blue-400' :
                      index === 1 ? 'bg-gradient-to-t from-green-500 to-green-400' :
                      index === 2 ? 'bg-gradient-to-t from-purple-500 to-purple-400' :
                      index === 3 ? 'bg-gradient-to-t from-yellow-500 to-yellow-400' :
                      index === 4 ? 'bg-gradient-to-t from-red-500 to-red-400' :
                      index === 5 ? 'bg-gradient-to-t from-indigo-500 to-indigo-400' :
                      'bg-gradient-to-t from-pink-500 to-pink-400'
                    }`}
                    style={{
                      height: `${[75, 85, 60, 90, 70, 45, 55][index]}%`
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {[75, 85, 60, 90, 70, 45, 55][index]}%
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  )
}
