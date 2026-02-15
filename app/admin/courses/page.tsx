'use client'

import { useState, useEffect } from 'react'
import { getCourses, deleteCourse } from '@/lib/actions/courses'
import Image from 'next/image'
import CourseModal from '@/components/admin/CourseModal'
import type { Course } from '@/lib/types'

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  useEffect(() => {
    loadCourses()
  }, [])

  async function loadCourses() {
    setLoading(true)
    const { courses } = await getCourses()
    setCourses(courses)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id)
      loadCourses()
    }
  }

  function handleEdit(course: any) {
    setSelectedCourse(course)
    setShowModal(true)
  }

  function handleAddNew() {
    setSelectedCourse(null)
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
    setSelectedCourse(null)
    loadCourses()
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Courses
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Add, edit, or delete courses
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Add Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
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
                      className="h-12 w-12 text-gray-400"
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
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {course.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {course.description || 'No description'}
                </p>
                {course.price && (
                  <p className="mt-2 text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    ${course.price}
                  </p>
                )}
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CourseModal course={selectedCourse} onClose={handleCloseModal} />
      )}
    </div>
  )
}
