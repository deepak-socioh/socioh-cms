import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import HolidayList from '@/components/HolidayList'

export default async function HolidaysPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Holiday Calendar</h1>
          <p className="mt-1 text-sm text-gray-600">
            {session.user.role === 'ADMIN' 
              ? 'Manage company holidays and events' 
              : 'View company holidays and events'}
          </p>
        </div>
        <HolidayList user={session.user} />
      </div>
    </DashboardLayout>
  )
}
