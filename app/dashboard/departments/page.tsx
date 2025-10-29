import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DepartmentManagement from '@/components/DepartmentManagement'

export default async function DepartmentsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return <DepartmentManagement />
}