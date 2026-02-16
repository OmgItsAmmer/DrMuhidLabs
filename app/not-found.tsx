import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1d]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="mt-4 text-xl text-zinc-400">Page not found</p>
        <p className="mt-2 text-sm text-zinc-500">The page you&apos;re looking for doesn&apos;t exist.</p>
        <div className="mt-6">
          <Link href="/" className="btn-gradient inline-block rounded-xl px-6 py-3 text-sm font-semibold">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}
