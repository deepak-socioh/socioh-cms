import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'

export default async function TeamPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    // <div className="py-10">
    //   {/* <header>
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //       <h1 className="text-3xl font-bold leading-tight text-gray-900">
    //         Team
    //       </h1>
    //       <p className="mt-2 text-sm text-gray-600">
    //         {session.user.role === 'ADMIN' 
    //           ? 'View and manage team members' 
    //           : 'View team members'}
    //       </p>
    //     </div>
    //   </header> */}
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <AdminDashboard readOnly={session.user.role !== 'ADMIN'} />
        </div>
      </main>
    // </div>
  )
}