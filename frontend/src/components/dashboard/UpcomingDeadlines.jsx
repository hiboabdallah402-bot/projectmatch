import { useMemo } from 'react'

function UpcomingDeadlines({ projects = [], isLoading = false }) {
  const upcomingDeadlines = useMemo(() => {
    // Sample deadlines with different projects
    const demoDeadlines = [
      { id: 1, title: 'Project Proposal Due', date: '2026-07-25', type: 'deadline', priority: 'high' },
      { id: 2, title: 'Team Meeting', date: '2026-07-22', type: 'meeting', priority: 'medium' },
      { id: 3, title: 'Supervisor Review', date: '2026-07-28', type: 'review', priority: 'high' },
      { id: 4, title: 'Sprint Planning', date: '2026-07-29', type: 'planning', priority: 'medium' },
      { id: 5, title: 'Final Submission', date: '2026-08-10', type: 'deadline', priority: 'high' },
    ]

    return demoDeadlines.map((deadline) => ({
      ...deadline,
      daysUntil: Math.ceil((new Date(deadline.date) - new Date()) / (1000 * 60 * 60 * 24)),
    }))
  }, [])

  const getIcon = (type) => {
    const icons = {
      deadline: '📋',
      meeting: '🤝',
      review: '👀',
      planning: '📅',
    }
    return icons[type] || '📌'
  }

  const getPriorityColor = (priority) => {
    return priority === 'high' ? 'text-red-600' : 'text-amber-600'
  }

  if (isLoading) {
    return (
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Upcoming Deadlines</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Upcoming Deadlines</h3>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="space-y-0 divide-y divide-gray-200">
          {upcomingDeadlines.slice(0, 5).map((deadline) => (
            <div
              key={deadline.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">{getIcon(deadline.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{deadline.title}</p>
                <p className="text-xs text-gray-500">
                  {deadline.daysUntil === 0
                    ? 'Today'
                    : deadline.daysUntil === 1
                      ? 'Tomorrow'
                      : `${deadline.daysUntil} days away`}
                </p>
              </div>
              <span className={`text-xs font-semibold ${getPriorityColor(deadline.priority)}`}>
                {deadline.priority === 'high' ? '🔴' : '🟡'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UpcomingDeadlines
