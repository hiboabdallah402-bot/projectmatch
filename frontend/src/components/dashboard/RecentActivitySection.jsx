function RecentActivitySection({ activities }) {
  const hasActivities = activities.length > 0

  // Demo activities shown when no real activity exists
  const demoActivities = [
    {
      id: 'demo-1',
      title: 'Ahmed applied to AI Attendance System',
      description: 'New application submitted • 2 hours ago',
    },
    {
      id: 'demo-2',
      title: 'Fatuma accepted into Smart Library project',
      description: 'Application accepted • 1 day ago',
    },
    {
      id: 'demo-3',
      title: 'New project published: Campus Navigation',
      description: 'Campus Navigation project by supervisor • 3 days ago',
    },
    {
      id: 'demo-4',
      title: 'Supervisor approved Hospital Management Analytics',
      description: 'Project approved and now visible to students • 5 days ago',
    },
  ]

  const displayActivities = hasActivities ? activities : demoActivities

  const getActivityIcon = (title) => {
    if (!title) {
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
    if (title.includes('published') || title.includes('Project')) {
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-6-4m6 4l6-4" />
        </svg>
      )
    }
    if (title.includes('Application')) {
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p className="mt-1 text-sm text-gray-500">Latest updates from your workspace</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            hasActivities
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-slate-100 text-slate-700'
          }`}>
            <span className={`h-2 w-2 rounded-full ${hasActivities ? 'bg-indigo-600' : 'bg-slate-400'}`}></span>
            {hasActivities ? 'Active' : 'Quiet'}
          </span>
        </div>
      </div>

      {hasActivities ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {displayActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
            >
              <div className="flex-shrink-0 rounded-lg bg-indigo-100 p-2.5 text-indigo-600">
                {getActivityIcon(activity.title)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-8">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {displayActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 transition hover:bg-gray-50"
              >
                <div className="flex-shrink-0 rounded-lg bg-gray-100 p-2.5 text-gray-600">
                  {getActivityIcon(activity.title)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center italic">Example activity • Your activity will appear here</p>
        </div>
      )}
    </section>
  )
}

export default RecentActivitySection
