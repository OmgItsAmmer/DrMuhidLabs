import { getUser, signOut } from '@/lib/actions/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <Link href="/admin" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">
                  DR Muhid Lab - Admin
                </span>
              </Link>
              <div className="ml-10 flex space-x-8">
                <Link
                  href="/admin/courses"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-900 hover:border-indigo-500 dark:text-white"
                >
                  Manage Courses
                </Link>
                <Link
                  href="/admin/verify"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-900 hover:border-indigo-500 dark:text-white"
                >
                  Verify Payments
                </Link>
                <Link
                  href="/admin/customers"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-900 hover:border-indigo-500 dark:text-white"
                >
                  Manage Customers
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  Admin
                </span>
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  {userData.profile?.full_name || userData.user.email}
                </span>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-600"
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
