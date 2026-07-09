function WelcomeCard({ userName, isLoading }) {
  const heading = isLoading
    ? 'Preparing your workspace...'
    : `Welcome${userName ? `, ${userName}` : ''}`

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.25),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(20,184,166,0.25),_transparent_38%)]" />
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
