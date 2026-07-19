import { Link } from 'react-router-dom'
import heroImage from '../assets/projectmatch-hero-illustration.svg'

const featureItems = [
  {
    title: 'Find the right project faster',
    description:
      'Search and compare opportunities that match your skills, interests, and academic goals without clutter.',
    icon: '01',
  },
  {
    title: 'Collaborate with clarity',
    description:
      'Team owners can describe project requirements clearly so students know where they fit before applying.',
    icon: '02',
  },
  {
    title: 'Track progress in one place',
    description:
      'Keep project, application, and profile information aligned through a structured workflow built for teams.',
    icon: '03',
  },
]

const statistics = [
  { value: '100+', label: 'Projects ready to discover' },
  { value: '24/7', label: 'Access to opportunities' },
  { value: '3 steps', label: 'From discovery to application' },
]

const heroConcepts = [
  {
    title: 'Discover Projects',
    description: 'Find academic and innovation projects that match your interests, skills, and career goals.',
  },
  {
    title: 'Build Strong Teams',
    description: 'Create teams, assign roles, review applications, and collaborate effectively.',
  },
  {
    title: 'Manage Projects',
    description: 'Track tasks, share files, communicate with teammates, and monitor project progress in one place.',
  },
  {
    title: 'AI Project Matching',
    description: 'Receive intelligent project recommendations based on your skills, interests, and previous experience.',
  },
]

const heroHighlights = [
  'Find projects faster',
  'Match team needs clearly',
  'Apply with confidence',
  'Track progress in one workspace',
]

const platformHeroCards = [
  {
    title: 'Discover Projects',
    description:
      'Find academic and innovation projects that match your interests, skills, and career goals.',
  },
  {
    title: 'Build Strong Teams',
    description: 'Create teams, assign roles, review applications, and collaborate effectively.',
  },
  {
    title: 'Manage Projects',
    description: 'Track tasks, share files, communicate with teammates, and monitor project progress in one place.',
  },
  {
    title: 'AI Project Matching',
    description:
      'Receive intelligent project recommendations based on your skills, interests, and previous experience.',
    isAi: true,
  },
]

function HomePage() {
  return (
    <div className="space-y-20 lg:space-y-24">
      <section className="relative overflow-hidden rounded-[2.75rem] border border-zinc-800 bg-black px-6 py-10 text-white shadow-[0_28px_90px_rgba(0,0,0,0.22)] sm:px-10 lg:px-14 lg:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_center,_rgba(255,255,255,0.08),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.12),_transparent_22%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-20 bottom-20 flex justify-between px-4 sm:px-8 lg:px-12">
          <div className="w-px bg-zinc-800/80" />
          <div className="w-px bg-zinc-800/80" />
        </div>

        <div className="relative flex flex-col items-center text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-[#050505] px-3 py-1.5 text-sm text-zinc-100">
            <div className="relative flex h-3.5 w-3.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p>Project discovery for modern student teams</p>
          </div>

          <div className="mt-6 max-w-4xl space-y-5">
            <h1 className="bg-gradient-to-r from-white via-zinc-100 to-zinc-500 bg-clip-text px-2 text-4xl font-semibold leading-tight text-transparent sm:text-5xl lg:text-[4rem] lg:leading-[1.05]">
              Collaborate, Build, and Manage Academic Projects in One Platform
            </h1>
            <p className="mx-auto max-w-2xl text-sm font-light leading-7 text-zinc-300 sm:text-base sm:leading-8">
              ProjectMatch is an AI-assisted collaboration platform that helps students discover projects, form teams,
              manage tasks, share files, communicate, and track progress from project idea to completion.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-gradient-to-b from-[#1E1E1E] to-[#050505] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-zinc-500"
            >
              Explore Projects
            </a>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-gradient-to-b from-[#1E1E1E] to-[#050505] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-zinc-500"
            >
              Get Started
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="m5.833 5.832 8.334 8.333m0-8.333v8.333H5.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="mt-10 grid w-full gap-3 self-stretch md:grid-cols-2 xl:grid-cols-4">
            {platformHeroCards.map((concept) => (
              <article
                key={concept.title}
                className={[
                  'rounded-2xl border p-4 text-left backdrop-blur-sm',
                  concept.isAi ? 'border-emerald-300/35 bg-emerald-400/10' : 'border-white/10 bg-white/5',
                ].join(' ')}
              >
                <p className="text-sm font-semibold text-white">{concept.title}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-300">{concept.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5 px-2 text-center">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-amber-400"
                  aria-hidden="true"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                </svg>
              ))}
            </div>
            <div className="hidden h-6 w-px bg-white/30 sm:block" />
            <p className="max-w-3xl text-sm text-zinc-300">
              Everything students need to discover, build, manage, and successfully complete academic projects in one collaborative workspace.
            </p>
          </div>

          <div className="mt-12 w-full border-b border-zinc-800">
            <div className="pointer-events-none absolute left-0 right-0 -mt-1.5 flex justify-between px-4 sm:px-8 lg:px-12">
              <div className="h-2.5 w-2.5 rotate-45 bg-white" />
              <div className="h-2.5 w-2.5 rotate-45 bg-white" />
            </div>
          </div>

          <div className="mt-10 w-full">
            <div className="rounded-[2rem] bg-[#242424] px-4 py-4 md:px-6 md:py-0 md:pt-8">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
                <div className="rounded-[1.7rem] border border-white/10 bg-black/35 p-4 text-left">
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-sm text-zinc-400">Hero concept</p>
                      <p className="text-lg font-semibold text-white">Wide project matching workspace</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                      Live
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-zinc-300">
                    Project-specific preview cards now reflect project discovery, matching quality, and application
                    readiness instead of a generic placeholder graphic.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {heroHighlights.map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        <p className="text-sm text-zinc-200">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d0d0d] p-4">
                  <img
                    src={heroImage}
                    alt="ProjectMatch dashboard preview"
                    className="h-auto max-h-[32rem] w-full object-contain object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="space-y-8 scroll-mt-28">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Features</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            A focused experience for students and project owners.
          </h2>
          <p className="text-base leading-7 text-slate-600">
            The landing page introduces the core value of ProjectMatch without pulling in unfinished auth or dashboard
            flows.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featureItems.map((item) => (
            <article key={item.title} className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-950">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-3 lg:gap-6">
        {statistics.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{stat.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Call to action</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Ready to discover your next project?</h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              ProjectMatch will grow into a complete platform for browsing projects, applying, and managing progress.
              The foundation now focuses on a strong public experience.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Review features
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage