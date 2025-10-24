import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import HolidayList from '@/components/HolidayList'

export default async function HolidaysPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <HolidayList user={session.user} />
    </div>
  )
}
