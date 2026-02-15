import { getMyCourses } from '@/lib/actions/courses'
import Image from 'next/image'
import Link from 'next/link'

export default async function MyCoursesPage() {
  const { courses } = await getMyCourses()

  // Function to extract YouTube video ID from URL
  function getYouTubeEmbedUrl(url: string) {
    const videoIdMatch = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&\n?#]+)/
    )
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : url
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Courses
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Access your purchased lecture courses
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            You don't have access to any courses yet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {course.title}
                    </h2>
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

                {/* Video Player */}
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

                {/* View Details Link */}
                <div className="mt-4">
                  <Link
                    href={`/dashboard/my-courses/${course.id}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    View details and leave a review
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
