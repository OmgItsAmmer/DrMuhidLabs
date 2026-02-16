export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1d]">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent" />
        <p className="mt-4 text-zinc-400">Loading...</p>
      </div>
    </div>
  )
}
