import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'

export default async function Home() {
  const userData = await getUser()

  if (!userData) {
    redirect('/login')
  }

  // Redirect based on role
  if (userData.profile?.role === 'admin') {
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}
