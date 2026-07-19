import DashboardStatCard from './DashboardStatCard'

function DashboardStatsSection({ stats }) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Statistics</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Dashboard statistics</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          A quick summary of your current activity across projects and applications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            note={stat.note}
          />
        ))}
      </div>
    </section>
  )
}

export default DashboardStatsSection
