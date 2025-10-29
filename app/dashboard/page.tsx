import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'
import UserProfile from '@/components/UserProfile'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return <UserProfile userId={session.user.id} />
}
