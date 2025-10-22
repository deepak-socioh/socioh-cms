import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import UserProfile from '@/components/UserProfile'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return <UserProfile userId={session.user.id} />
}
