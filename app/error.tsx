'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 dark:text-red-400">
          Error
        </h1>
        <p className="mt-4 text-xl text-gray-900 dark:text-white">
          Something went wrong!
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => reset()}
            className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-block rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
