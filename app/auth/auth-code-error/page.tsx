import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 dark:text-red-400">
            Authentication Error
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            There was an error signing you in. Please try again.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
