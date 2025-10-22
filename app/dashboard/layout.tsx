import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={session.user} />
      <main>{children}</main>
    </div>
  )
}
