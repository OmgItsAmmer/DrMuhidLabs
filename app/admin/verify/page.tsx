'use client'

import { useState, useEffect } from 'react'
import { getPendingPayments, verifyPayment, rejectPayment } from '@/lib/actions/payments'
import Image from 'next/image'

export default function VerifyPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
  }, [])

  async function loadPayments() {
    setLoading(true)
    const { payments } = await getPendingPayments()
    setPayments(payments)
    setLoading(false)
  }

  async function handleVerify(paymentId: string) {
    if (confirm('Grant access to this course?')) {
      await verifyPayment(paymentId)
      loadPayments()
    }
  }

  async function handleReject(paymentId: string) {
    if (confirm('Reject this payment?')) {
      await rejectPayment(paymentId)
      loadPayments()
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-500 border-r-transparent" />
          <p className="text-sm text-slate-400">Loading pending payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Verify Payments</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review and approve pending payment requests
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 py-16 text-center">
          <p className="text-slate-400">No pending payments.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-xl"
            >
              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                <div className="flex-shrink-0">
                  <div className="relative h-24 w-32 overflow-hidden rounded-xl bg-slate-700">
                    {payment.courses?.thumbnail_url ? (
                      <Image
                        src={payment.courses.thumbnail_url}
                        alt={payment.courses.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg
                          className="h-8 w-8 text-slate-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-3 sm:grid sm:grid-cols-3 sm:gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Customer
                    </p>
                    <p className="mt-1 font-medium text-white">
                      {payment.profiles?.full_name || 'N/A'}
                    </p>
                    <p className="text-sm text-slate-400">{payment.profiles?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Course
                    </p>
                    <p className="mt-1 font-medium text-white">{payment.courses?.title}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Transaction ID
                    </p>
                    <p className="mt-1 font-mono text-sm font-medium text-teal-400">
                      {payment.transaction_id}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(payment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:w-32">
                  <button
                    onClick={() => handleVerify(payment.id)}
                    className="rounded-xl bg-emerald-500/20 py-2.5 text-sm font-semibold text-emerald-400 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/30"
                  >
                    Grant Access
                  </button>
                  <button
                    onClick={() => handleReject(payment.id)}
                    className="rounded-xl bg-red-500/20 py-2.5 text-sm font-semibold text-red-400 ring-1 ring-red-500/30 transition hover:bg-red-500/30"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
