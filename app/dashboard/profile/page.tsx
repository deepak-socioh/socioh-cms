import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import ProfileCards from '@/components/ProfileCards'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <DashboardLayout>
      <div className="w-full p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your personal information and settings
          </p>
        </div>
        <ProfileCards userId={session.user.id} />
      </div>
    </DashboardLayout>
  )
}