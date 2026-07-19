function DashboardStatCard({ title, value, note }) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{value}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{note}</p>
    </article>
  )
}

export default DashboardStatCard
