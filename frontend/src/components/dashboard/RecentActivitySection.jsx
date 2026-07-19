function RecentActivitySection({ activities }) {
  const hasActivities = activities.length > 0

  return (
    <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Activity</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Recent activity</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            The most recent updates tied to your published projects and submitted applications.
          </p>
        </div>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
          {hasActivities ? 'Updated' : 'Quiet'}
        </span>
      </div>

      {hasActivities ? (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <p className="font-medium text-slate-900">{activity.title}</p>
              <p className="mt-1 text-slate-600">{activity.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm leading-7 text-slate-600">
          No recent activity yet. Publish projects or submit applications to see updates here.
        </div>
      )}
    </section>
  )
}

export default RecentActivitySection
