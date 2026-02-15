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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manage Customers
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          View customer information and their purchased courses
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {customers.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No customers found.
              </p>
            ) : (
              customers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer.id)}
                  className={`w-full rounded-lg p-4 text-left transition-colors ${
                    selectedCustomer?.id === customer.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20'
                      : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {customer.avatar_url ? (
                      <Image
                        src={customer.avatar_url}
                        alt={customer.full_name || 'Customer'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
                        {customer.full_name?.[0] || customer.email[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-gray-900 dark:text-white">
                        {customer.full_name || 'N/A'}
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedCustomer.full_name || 'N/A'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {selectedCustomer.email}
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    Joined{' '}
                    {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Purchased Courses ({customerCourses.length})
                </h3>

                {customerCourses.length === 0 ? (
                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    No courses purchased yet.
                  </p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {customerCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                      >
                        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
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
                                className="h-6 w-6 text-gray-400"
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
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {course.title}
                          </p>
                          {course.price && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              ${course.price}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg bg-gray-50 p-12 dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">
                Select a customer to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
