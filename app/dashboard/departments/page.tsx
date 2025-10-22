import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DepartmentDashboard from '@/components/DepartmentDashboard'

export default async function DepartmentsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Only admins can access department management
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return <DepartmentDashboard />
}
