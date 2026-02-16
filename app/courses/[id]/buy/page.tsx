'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { submitPayment } from '@/lib/actions/payments'
import Link from 'next/link'

export default function BuyCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [transactionId, setTransactionId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!transactionId.trim()) {
      setError('Please enter a transaction ID')
      setLoading(false)
      return
    }

    const result = await submitPayment(courseId, transactionId)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1d] px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#252528] p-10 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
              <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white">Payment Submitted!</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Your payment is being verified. You will receive access once confirmed.
            </p>
            <p className="mt-4 text-sm text-zinc-500">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1d] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#252528] p-10 shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">Upload Payment Proof</h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Enter your transaction ID to verify your payment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="transactionId" className="block text-sm font-medium text-zinc-300">
              Transaction ID
            </label>
            <input
              id="transactionId"
              name="transactionId"
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              className="mt-1 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Enter your transaction ID"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Payment'}
            </button>
            <Link
              href={`/courses/${courseId}`}
              className="flex w-full justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
