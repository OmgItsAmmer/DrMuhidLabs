import { getUser, signOut } from '@/lib/actions/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminNavMobile, AdminSidebar } from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userData = await getUser()

  if (!userData) {
    redirect('/login')
  }

  if (userData.profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Top bar: clear Admin identity */}
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">DR Muhid Lab</span>
              <span className="rounded-md bg-teal-500/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-teal-400 ring-1 ring-teal-500/30">
                Admin
              </span>
            </Link>
      
          </div>
          <div className="flex items-center gap-3">
            <span className="max-w-[140px] truncate text-sm text-slate-400">
              {userData.profile?.full_name || userData.user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:border-teal-500/50 hover:bg-slate-700 hover:text-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-56 flex-col border-r border-slate-700/50 bg-slate-900/50 lg:flex">
          <AdminSidebar />
        </aside>

        <div className="min-h-[calc(100vh-3.5rem)] flex-1 lg:pl-56">
          <div className="border-b border-slate-700/50 bg-slate-900/30 lg:hidden">
            <AdminNavMobile />
          </div>
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
