import { getCourses } from '@/lib/actions/courses'
import Link from 'next/link'
import Image from 'next/image'

const CARD_GRADIENTS = [
  'linear-gradient(145deg, #ec4899 0%, #db2777 100%)',
  'linear-gradient(145deg, #f97316 0%, #ea580c 100%)',
  'linear-gradient(145deg, #38bdf8 0%, #0ea5e9 100%)',
  'linear-gradient(145deg, #a855f7 0%, #7c3aed 100%)',
  'linear-gradient(145deg, #22d3ee 0%, #06b6d4 100%)',
]

export default async function DashboardPage() {
  const { courses } = await getCourses()

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12">
          <Image
            src="/images/logo.png"
            alt="Muhid Saeed Lectures logo"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Course Dashboard</h1>
          <p className="text-sm text-zinc-400">
            Browse and manage the latest lectures from DR Muhid Lab.
          </p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#252528] py-16 text-center">
          <p className="text-zinc-400">
            No courses available at the moment. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#252528] shadow-xl transition hover:scale-[1.02] hover:border-white/20 hover:shadow-2xl"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                {course.thumbnail_url ? (
                  <Image
                    src={course.thumbnail_url}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="flex h-full items-center justify-center"
                    style={{ background: CARD_GRADIENTS[i % CARD_GRADIENTS.length] }}
                  >
                    <span className="text-5xl opacity-80">📚</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">
                  {course.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                  {course.description || 'No description available'}
                </p>
                {course.price != null && (
                  <p className="mt-4 text-xl font-bold text-orange-400">
                    ${course.price}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
