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
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1d]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-400">Error</h1>
        <p className="mt-4 text-xl text-white">Something went wrong!</p>
        <p className="mt-2 text-sm text-zinc-400">{error.message || 'An unexpected error occurred'}</p>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={() => reset()} className="btn-gradient rounded-xl px-6 py-3 text-sm font-semibold">
            Try again
          </button>
          <a href="/" className="inline-block rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
