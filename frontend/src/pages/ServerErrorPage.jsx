import { Link } from 'react-router-dom'

function ServerErrorPage() {
  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-700">Server error</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Something went wrong</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        The application hit an unexpected problem while loading this page. Try again or continue from a safe route.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Go to Home
        </Link>
        <Link
          to="/app"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Go to Dashboard
        </Link>
      </div>
    </section>
  )
}

export default ServerErrorPage
