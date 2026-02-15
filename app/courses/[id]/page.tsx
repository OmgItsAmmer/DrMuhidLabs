import { getCourse, hasAccess } from '@/lib/actions/courses'
import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getUser } from '@/lib/actions/auth'

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { course } = await getCourse(id)
  const userData = await getUser()

  if (!course) {
    notFound()
  }

  // Check if user has access
  const userHasAccess = userData ? await hasAccess(id) : false

  // If user has access, redirect to my-courses page to view the video
  if (userHasAccess) {
    redirect(`/dashboard/my-courses`)
  }

  // TypeScript doesn't know notFound() throws, so we assert course is not null
  const validCourse = course

  const allImages = [
    ...(validCourse.thumbnail_url ? [validCourse.thumbnail_url] : []),
    ...(validCourse.course_images?.map((img) => img.image_url) || []),
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              {allImages.length > 0 ? (
                <>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={allImages[0]}
                      alt={validCourse.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {allImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {allImages.slice(1, 5).map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"
                        >
                          <Image
                            src={img}
                            alt={`${validCourse.title} ${idx + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                  <svg
                    className="h-20 w-20 text-gray-400"
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

            {/* Course Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {validCourse.title}
                </h1>
                {validCourse.uploaded_by_profile && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    By {validCourse.uploaded_by_profile.full_name}
                  </p>
                )}
              </div>

              {validCourse.price && (
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  ${validCourse.price}
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Description
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {validCourse.description || 'No description available'}
                </p>
              </div>

              {/* Buy Button */}
              {userData ? (
                <Link
                  href={`/courses/${validCourse.id}/buy`}
                  className="block w-full rounded-lg bg-indigo-600 px-6 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Buy Lecture
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block w-full rounded-lg bg-indigo-600 px-6 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in to Buy
                </Link>
              )}

              <Link
                href="/dashboard"
                className="block w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Back to Courses
              </Link>
            </div>
          </div>

          {/* Reviews Section */}
          {validCourse.reviews && validCourse.reviews.length > 0 && (
            <div className="border-t border-gray-200 p-8 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reviews
              </h2>
              <div className="mt-6 space-y-6">
                {validCourse.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {review.profiles?.avatar_url ? (
                          <Image
                            src={review.profiles.avatar_url}
                            alt={review.profiles.full_name || 'User'}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                            {review.profiles?.full_name?.[0] || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {review.profiles?.full_name || 'Anonymous'}
                          </p>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {review.comment && (
                      <p className="mt-4 text-gray-600 dark:text-gray-300">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
