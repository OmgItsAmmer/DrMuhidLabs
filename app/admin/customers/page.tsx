'use client'

import { useState, useEffect } from 'react'
import { getCustomers, getCustomerDetails } from '@/lib/actions/customers'
import Image from 'next/image'

export default function ManageCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [customerCourses, setCustomerCourses] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomers()
  }, [searchQuery])

  async function loadCustomers() {
    setLoading(true)
    const { customers } = await getCustomers(searchQuery)
    setCustomers(customers)
    setLoading(false)
  }

  async function handleSelectCustomer(customerId: string) {
    const { customer, courses } = await getCustomerDetails(customerId)
    setSelectedCustomer(customer)
    setCustomerCourses(courses)
  }

  function handleCloseDetails() {
    setSelectedCustomer(null)
    setCustomerCourses([])
  }

  if (loading && customers.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-500 border-r-transparent" />
          <p className="text-sm text-slate-400">Loading customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Manage Customers</h1>
        <p className="mt-1 text-sm text-slate-400">
          View customer information and their purchased courses
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-600 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {customers.length === 0 ? (
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 py-12 text-center">
                <p className="text-slate-400">No customers found.</p>
              </div>
            ) : (
              customers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selectedCustomer?.id === customer.id
                      ? 'border-teal-500/50 bg-teal-500/10'
                      : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {customer.avatar_url ? (
                      <Image
                        src={customer.avatar_url}
                        alt={customer.full_name || 'Customer'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/20 text-sm font-semibold text-teal-400">
                        {customer.full_name?.[0] || customer.email[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">
                        {customer.full_name || 'N/A'}
                      </p>
                      <p className="truncate text-sm text-slate-400">{customer.email}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 shadow-xl">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedCustomer.full_name || 'N/A'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">{selectedCustomer.email}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Joined {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-700 hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Purchased Courses ({customerCourses.length})
                </h3>

                {customerCourses.length === 0 ? (
                  <p className="mt-4 text-slate-400">No courses purchased yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {customerCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
                      >
                        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-700">
                          {course.thumbnail_url ? (
                            <Image
                              src={course.thumbnail_url}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <svg
                                className="h-6 w-6 text-slate-500"
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
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white">{course.title}</p>
                          {course.price != null && (
                            <p className="mt-1 text-sm text-teal-400">${course.price}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-700/50 border-dashed bg-slate-800/20">
              <p className="text-slate-500">Select a customer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
