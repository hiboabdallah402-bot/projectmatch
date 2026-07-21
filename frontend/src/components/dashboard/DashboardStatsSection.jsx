import DashboardStatCard from './DashboardStatCard'

function DashboardStatsSection({ stats }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
