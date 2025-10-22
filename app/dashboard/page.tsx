import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'
import UserProfile from '@/components/UserProfile'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (session.user.role === 'ADMIN') {
    return <AdminDashboard />
  }

  return <UserProfile userId={session.user.id} />
}
