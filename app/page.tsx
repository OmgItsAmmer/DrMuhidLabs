import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'
import LandingPage from '@/components/landing/LandingPage'

export default async function Home() {
  const userData = await getUser()

  if (userData) {
    if (userData.profile?.role === 'admin') {
      redirect('/admin')
    }
    redirect('/dashboard')
  }

  return <LandingPage />
}
