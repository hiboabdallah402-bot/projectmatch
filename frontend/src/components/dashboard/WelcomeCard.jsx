function WelcomeCard({ userName, isLoading }) {
  const heading = isLoading
    ? 'Preparing your workspace...'
    : `Welcome${userName ? `, ${userName}` : ''}`

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:px-8 sm:py-10">
      <div className="relative space-y-4">
        <p className="inline-flex rounded-full border border-cyan-400/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
          Dashboard overview
        </p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Manage projects, applications, and profile updates from a single workspace tailored for ProjectMatch collaboration.
          </p>
        </div>
      </div>
    </section>
  )
}

export default WelcomeCard
