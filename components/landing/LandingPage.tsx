import Link from 'next/link'
import Image from 'next/image'
import { getCourses } from '@/lib/actions/courses'

const CARD_COLORS = ['card-pink', 'card-orange', 'card-blue', 'card-purple', 'card-cyan'] as const

export default async function LandingPage() {
  const { courses } = await getCourses()
  const displayCourses = courses.slice(0, 5)

  return (
    <div className="min-h-screen bg-[#1a1a1d]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#1a1a1d]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src="/images/logo.png"
                alt="Muhid Saeed Lectures logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-white">DR Muhid Lab</span>
          </Link>
          {/* <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-white/90 hover:text-white">
              Home
            </Link>
            <Link href="/#courses" className="text-sm font-medium text-white/70 hover:text-white">
              Category
            </Link>
            <Link href="/#courses" className="text-sm font-medium text-white/70 hover:text-white">
              Courses
            </Link>
            <Link href="/#courses" className="text-sm font-medium text-white/70 hover:text-white">
              Blog
            </Link>
          </div> */}
          <Link
            href="/login"
            className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/30"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Investing in Knowledge and{' '}
                <span className="gradient-text">Your Future</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-zinc-400">
                Our e-learning programs have been developed to be a vehicle of delivering multimedia
                learning solutions for your business.
              </p>
              <Link
                href="/login"
                className="btn-gradient mt-8 inline-flex rounded-xl px-8 py-4 text-base"
              >
                Get Started
              </Link>
              <div className="mt-12 flex gap-12">
                <div>
                  <p className="text-3xl font-bold text-white">50+</p>
                  <p className="mt-1 text-sm text-zinc-500">Career Courses</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">100+</p>
                  <p className="mt-1 text-sm text-zinc-500">Our Students</p>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative h-[380px] w-[320px] rounded-3xl bg-gradient-to-br from-[#252528] to-[#1a1a1d] p-8 shadow-2xl">
                <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 opacity-90" />
                <div className="absolute bottom-8 right-8 h-6 w-6 rounded-full bg-orange-400" />
                <div className="absolute left-4 top-1/2 h-4 w-4 rounded-full bg-orange-300" />
                <div className="relative flex h-full flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
                    <div className="h-8 w-8 rounded-full bg-zinc-600" />
                    <span>175K+ Assisted Students</span>
                  </div>
                  <p className="mb-3 text-sm font-medium text-white">Learning Chart</p>
                  <div className="flex flex-1 items-end gap-2">
                    {[40, 70, 50, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t"
                        style={{
                          height: `${h}%`,
                          background:
                            i === 0
                              ? 'linear-gradient(180deg, #ec4899, #db2777)'
                              : i === 1
                                ? 'linear-gradient(180deg, #38bdf8, #0ea5e9)'
                                : i === 2
                                  ? 'linear-gradient(180deg, #f97316, #ea580c)'
                                  : 'linear-gradient(180deg, #a855f7, #7c3aed)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course browse */}
      {/* <section id="courses" className="border-t border-white/5 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Browse Top Essential Career Courses
          </h2>
          <div className="mt-10 flex flex-wrap items-stretch gap-6">
            {displayCourses.length > 0 ? (
              displayCourses.map((course, i) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group flex min-w-[180px] max-w-[220px] flex-1 flex-col rounded-2xl p-6 text-white shadow-xl transition hover:scale-[1.02] hover:shadow-2xl"
                  style={{
                    background:
                      i % 5 === 0
                        ? 'linear-gradient(145deg, #ec4899 0%, #db2777 100%)'
                        : i % 5 === 1
                          ? 'linear-gradient(145deg, #f97316 0%, #ea580c 100%)'
                          : i % 5 === 2
                            ? 'linear-gradient(145deg, #38bdf8 0%, #0ea5e9 100%)'
                            : i % 5 === 3
                              ? 'linear-gradient(145deg, #a855f7 0%, #7c3aed 100%)'
                              : 'linear-gradient(145deg, #22d3ee 0%, #06b6d4 100%)',
                  }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl">
                    📚
                  </div>
                  <h3 className="font-semibold leading-tight">{course.title}</h3>
                  <span className="mt-auto pt-4 text-sm font-medium opacity-90 group-hover:underline">
                    View course →
                  </span>
                </Link>
              ))
            ) : (
              <>
                {[
                  { title: 'UI/UX Design', emoji: '✏️' },
                  { title: 'Web Development', emoji: '</>' },
                  { title: 'Digital Marketing', emoji: '📢' },
                  { title: 'Practical Learning', emoji: 'C' },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    className={`flex min-w-[180px] max-w-[220px] flex-1 flex-col rounded-2xl p-6 text-white ${CARD_COLORS[i % CARD_COLORS.length]}`}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl">
                      {item.emoji}
                    </div>
                    <h3 className="font-semibold leading-tight">{item.title}</h3>
                  </div>
                ))}
              </>
            )}
            <Link
              href="/login"
              className="flex min-w-[140px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/30 bg-white/5 p-8 text-white/80 transition hover:border-orange-500 hover:bg-orange-500/10 hover:text-orange-400"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-2xl text-white">
                →
              </span>
              <span className="mt-3 text-sm font-medium">Browse All</span>
            </Link>
          </div>
        </div>
      </section> */}
    </div>
  )
}
