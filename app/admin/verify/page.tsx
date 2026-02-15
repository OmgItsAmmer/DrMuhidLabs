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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Verify Payments
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Review and approve pending payment requests
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No pending payments.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800"
            >
              <div className="flex items-center p-6">
                <div className="flex-shrink-0">
                  <div className="relative h-24 w-32 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
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
                          className="h-8 w-8 text-gray-400"
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

                <div className="ml-6 flex-1">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Customer
                      </p>
                      <p className="mt-1 font-medium text-gray-900 dark:text-white">
                        {payment.profiles?.full_name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {payment.profiles?.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Course
                      </p>
                      <p className="mt-1 font-medium text-gray-900 dark:text-white">
                        {payment.courses?.title}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Transaction ID
                      </p>
                      <p className="mt-1 font-mono text-sm font-medium text-gray-900 dark:text-white">
                        {payment.transaction_id}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(payment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <button
                    onClick={() => handleVerify(payment.id)}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Grant Access
                  </button>
                  <button
                    onClick={() => handleReject(payment.id)}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
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
