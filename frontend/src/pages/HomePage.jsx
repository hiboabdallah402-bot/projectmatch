import { Link } from 'react-router-dom'

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

function HomePage() {
  return (
    <div className="space-y-20 lg:space-y-24">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 px-6 py-16 text-white shadow-xl sm:px-10 lg:px-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(15,118,110,0.22),_transparent_30%)]" />
        <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex w-fit rounded-full border border-cyan-400/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              ProjectMatch
            </p>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Match students with the right final year project, faster and smarter.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Discover project opportunities, connect with collaborators, and move from idea to application in a clean
                workflow designed for final year teams.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
              >
                Explore features
              </a>
              <Link
                to="/setup-status"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                View setup status
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-300">Current focus</p>
                  <p className="text-lg font-semibold text-white">Project discovery</p>
                </div>
                <div className="rounded-2xl bg-cyan-400/15 px-3 py-2 text-sm font-semibold text-cyan-200">
                  Active
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  'Search projects by skills and team size',
                  'Review requirements before applying',
                  'Submit applications with confidence',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    <p className="text-sm text-slate-200">{item}</p>
                  </div>
                ))}
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
            <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-3 lg:gap-6">
        {statistics.map((stat) => (
          <article key={stat.label} className="rounded-2xl bg-slate-50 p-6 text-center">
            <p className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{stat.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white shadow-xl sm:px-10 sm:py-14 lg:px-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Call to action</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ready to discover your next project?</h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              ProjectMatch will grow into a complete platform for browsing projects, applying, and managing progress.
              The foundation now focuses on a strong public experience.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              to="#features"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
            >
              Review features
            </Link>
            <Link
              to="/setup-status"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Check setup status
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage