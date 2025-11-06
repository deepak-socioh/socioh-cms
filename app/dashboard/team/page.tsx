import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import AdminDashboard from '@/components/AdminDashboard'

export default async function TeamPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <DashboardLayout>
      <div className="w-full p-6">
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Directory</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {session.user.role === 'ADMIN' 
              ? 'View and manage team members' 
              : 'Browse your team members'}
          </p>
        </div> */}
        <AdminDashboard readOnly={session.user.role !== 'ADMIN'} />
      </div>
    </DashboardLayout>
  )
}