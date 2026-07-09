import { Link } from 'react-router-dom'

const principles = [
  {
    title: 'Clarity first',
    detail: 'Project requirements and team expectations are visible before students apply.',
  },
  {
    title: 'Reusable workflows',
    detail: 'Projects, applications, and profile updates share consistent patterns across the app.',
  },
  {
    title: 'Collaboration-ready',
    detail: 'Owners and applicants can track status updates without page reload friction.',
  },
]

function AboutPage() {
  return (
    <section className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
          About ProjectMatch
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Built for final year teams to discover and deliver better projects.
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          ProjectMatch is a focused collaboration platform for students and project owners. It helps teams discover
          opportunities, apply with context, and manage delivery workflows with a clean, modern interface.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {principles.map((item) => (
          <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5">
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.detail}</p>
          </article>
        ))}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/register"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Create account
        </Link>
        <Link
          to="/app"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Open dashboard
        </Link>
      </div>
    </section>
  )
}

export default AboutPage
