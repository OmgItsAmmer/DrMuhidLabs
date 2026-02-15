import { getCourse } from '@/lib/actions/courses'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ReviewForm from '@/components/course/ReviewForm'
import { revalidatePath } from 'next/cache'

export default async function MyCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { course } = await getCourse(id)

  if (!course) {
    notFound()
  }

  function getYouTubeEmbedUrl(url: string) {
    const videoIdMatch = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&\n?#]+)/
    )
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : url
  }

  async function handleReviewSuccess() {
    'use server'
    revalidatePath(`/dashboard/my-courses/${id}`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {course.title}
                </h1>
                {course.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {course.description}
                  </p>
                )}
              </div>
              {course.thumbnail_url && (
                <div className="ml-6 flex-shrink-0">
                  <div className="relative h-20 w-32 overflow-hidden rounded-lg">
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(course.youtube_url)}
                  title={course.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Add Review */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Leave a Review
            </h2>
            <ReviewForm courseId={course.id} onSuccess={handleReviewSuccess} />
          </div>

          {/* Existing Reviews */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Reviews ({course.reviews?.length || 0})
            </h2>

            {!course.reviews || course.reviews.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              <div className="space-y-4">
                {course.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {review.profiles?.avatar_url ? (
                          <Image
                            src={review.profiles.avatar_url}
                            alt={review.profiles.full_name || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                            {review.profiles?.full_name?.[0] || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {review.profiles?.full_name || 'Anonymous'}
                          </p>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
