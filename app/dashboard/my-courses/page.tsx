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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">My Courses</h1>
        <p className="mt-2 text-zinc-400">Access your purchased lecture courses</p>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#252528] py-16 text-center">
          <p className="text-zinc-400">You don&apos;t have access to any courses yet.</p>
          <Link
            href="/dashboard"
            className="btn-gradient mt-4 inline-block rounded-xl px-6 py-2.5 text-sm font-semibold"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#252528] shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold text-white">{course.title}</h2>
                    {course.description && (
                      <p className="mt-2 text-zinc-400">{course.description}</p>
                    )}
                  </div>
                  {course.thumbnail_url && (
                    <div className="flex-shrink-0">
                      <div className="relative h-20 w-32 overflow-hidden rounded-xl">
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
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                    <iframe
                      src={getYouTubeEmbedUrl(course.youtube_url)}
                      title={course.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/dashboard/my-courses/${course.id}`}
                    className="inline-flex items-center text-sm font-medium text-orange-400 hover:text-orange-300"
                  >
                    View details and leave a review
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
