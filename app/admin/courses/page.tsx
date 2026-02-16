'use client'

import { useState, useEffect } from 'react'
import { getCourses, deleteCourse } from '@/lib/actions/courses'
import Image from 'next/image'
import CourseModal from '@/components/admin/CourseModal'
import type { Course } from '@/lib/types'

const DESCRIPTION_LINES = 2

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleDescription(courseId: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(courseId)) next.delete(courseId)
      else next.add(courseId)
      return next
    })
  }

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
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-500 border-r-transparent" />
          <p className="text-sm text-slate-400">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Manage Courses</h1>
          <p className="mt-1 text-sm text-slate-400">Add, edit, or delete courses</p>
        </div>
        <button
          onClick={handleAddNew}
          className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-600"
        >
          Add Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 py-16 text-center">
          <p className="text-slate-400">No courses yet.</p>
          <button
            onClick={handleAddNew}
            className="mt-4 rounded-xl bg-teal-500/20 px-4 py-2 text-sm font-medium text-teal-400 ring-1 ring-teal-500/30 hover:bg-teal-500/30"
          >
            Add your first course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const desc = course.description || 'No description'
            const isExpanded = expandedIds.has(course.id)
            const needsReadMore = desc.length > 80

            return (
              <div
                key={course.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-xl transition hover:border-slate-600"
              >
                <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-700/50">
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
                        className="h-12 w-12 text-slate-500"
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
                <div className="flex min-h-0 flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                  <div className="mt-2 min-h-[2.5rem]">
                    <p
                      className="text-sm text-slate-400"
                      style={isExpanded ? undefined : { display: '-webkit-box', WebkitLineClamp: DESCRIPTION_LINES, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}
                    >
                      {desc}
                    </p>
                    {needsReadMore && (
                      <button
                        type="button"
                        onClick={() => toggleDescription(course.id)}
                        className="mt-1 text-xs font-medium text-teal-400 hover:text-teal-300"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                  {course.price != null && (
                    <p className="mt-2 text-lg font-bold text-teal-400">${course.price}</p>
                  )}
                  <div className="mt-auto flex gap-2 pt-4">
                    <button
                      onClick={() => handleEdit(course)}
                      className="flex-1 rounded-lg bg-teal-500/20 py-2 text-sm font-semibold text-teal-400 ring-1 ring-teal-500/30 transition hover:bg-teal-500/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="flex-1 rounded-lg bg-red-500/20 py-2 text-sm font-semibold text-red-400 ring-1 ring-red-500/30 transition hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <CourseModal course={selectedCourse} onClose={handleCloseModal} />
      )}
    </div>
  )
}
