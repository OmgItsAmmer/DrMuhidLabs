import { signInWithGoogle } from '@/lib/actions/auth'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a1d] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-[#252528] p-10 shadow-2xl">
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold text-white">
              Dr Muhid's Lectures
            </Link>
            <h1 className="mt-6 text-3xl font-bold text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Sign in to access your courses and continue learning
            </p>
          </div>

          <form action={signInWithGoogle} className="mt-8">
            <button
              type="submit"
              className="btn-gradient flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold"
            >
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
