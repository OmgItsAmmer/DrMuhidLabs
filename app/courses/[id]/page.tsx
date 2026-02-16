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

  const userHasAccess = userData ? await hasAccess(id) : false

  if (userHasAccess) {
    redirect(`/dashboard/my-courses`)
  }

  const validCourse = course

  const allImages = [
    ...(validCourse.thumbnail_url ? [validCourse.thumbnail_url] : []),
    ...(validCourse.course_images?.map((img) => img.image_url) || []),
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#252528] shadow-2xl">
          <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-2">
            <div className="space-y-4">
              {allImages.length > 0 ? (
                <>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#1a1a1d]">
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
                          className="relative aspect-video overflow-hidden rounded-lg bg-[#1a1a1d]"
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
                <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-purple-500/20">
                  <span className="text-6xl opacity-60">📚</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {validCourse.title}
                </h1>
                {validCourse.uploaded_by_profile && (
                  <p className="mt-2 text-sm text-zinc-400">
                    By {validCourse.uploaded_by_profile.full_name}
                  </p>
                )}
              </div>

              {validCourse.price != null && (
                <div className="text-3xl font-bold text-orange-400">
                  ${validCourse.price}
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Description
                </h2>
                <p className="mt-2 text-zinc-400">
                  {validCourse.description || 'No description available'}
                </p>
              </div>

              {userData ? (
                <Link
                  href={`/courses/${validCourse.id}/buy`}
                  className="btn-gradient block w-full rounded-xl px-6 py-3.5 text-center text-base font-semibold"
                >
                  Buy Lecture
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="btn-gradient block w-full rounded-xl px-6 py-3.5 text-center text-base font-semibold"
                >
                  Sign in to Buy
                </Link>
              )}

              <Link
                href="/"
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-white/10"
              >
                Back to Courses
              </Link>
            </div>
          </div>

          {validCourse.reviews && validCourse.reviews.length > 0 && (
            <div className="border-t border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white">
                Reviews
              </h2>
              <div className="mt-6 space-y-6">
                {validCourse.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {review.profiles?.avatar_url ? (
                          <Image
                            src={review.profiles.avatar_url}
                            alt={review.profiles.full_name || 'User'}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 font-semibold text-white">
                            {review.profiles?.full_name?.[0] || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-white">
                            {review.profiles?.full_name || 'Anonymous'}
                          </p>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating
                                    ? 'text-amber-400'
                                    : 'text-zinc-600'
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
                      <p className="text-sm text-zinc-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {review.comment && (
                      <p className="mt-4 text-zinc-300">
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
