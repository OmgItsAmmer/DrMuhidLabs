import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
          Page not found
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}
