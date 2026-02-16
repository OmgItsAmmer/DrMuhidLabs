import { getUser, signOut } from '@/lib/actions/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userData = await getUser()

  if (!userData) {
    redirect('/login')
  }

  if (userData.profile?.role === 'admin') {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-[#1a1a1d]">
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#1a1a1d]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-10">
              <Link href="/dashboard" className="text-xl font-bold text-white">
                Dr Muhid's Lectures
              </Link>
              <div className="hidden gap-8 sm:flex">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-white/90 hover:text-white"
                >
                  All Courses
                </Link>
                <Link
                  href="/dashboard/my-courses"
                  className="text-sm font-medium text-white/70 hover:text-white"
                >
                  My Courses
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="max-w-[160px] truncate text-sm text-zinc-400">
                {userData.profile?.full_name || userData.user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
