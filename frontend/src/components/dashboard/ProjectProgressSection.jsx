import { useMemo } from 'react'

function ProjectProgressSection({ projects = [], isLoading = false }) {
  // Check if there's meaningful data
  const hasData = useMemo(() => {
    return Array.isArray(projects) && projects.length > 0
  }, [projects])

  // Get progress bar color based on percentage
  const getProgressColor = (percent) => {
    if (percent >= 75) return 'bg-green-500'
    if (percent >= 50) return 'bg-blue-500'
    if (percent >= 25) return 'bg-amber-500'
    return 'bg-red-500'
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-emerald-100 text-emerald-800'
      case 'closed':
        return 'bg-slate-100 text-slate-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-xl font-semibold text-slate-900">Project Progress</h2>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="mb-2 h-4 w-40 rounded bg-slate-100" />
                <div className="h-2 w-full rounded bg-slate-100" />
                <div className="mt-2 h-3 w-16 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Show empty state if no data
  if (!hasData) {
    return (
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-xl font-semibold text-slate-900">Project Progress</h2>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white py-12 text-center shadow-sm">
          <div className="mb-3 text-4xl">📋</div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">No projects to track</h3>
          <p className="text-sm text-slate-500">
            Create a project or join a team to see progress tracking here.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-semibold text-slate-900">Project Progress</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <h3 className="font-semibold text-slate-900 flex-1 pr-2">{project.title}</h3>
              <span className={`inline-block rounded px-2.5 py-1 text-xs font-semibold capitalize ${getStatusBadgeColor(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>

            {/* Task stats */}
            <div className="mb-3 flex items-baseline gap-2 text-sm">
              <span className="font-semibold text-slate-900">{project.completed_tasks}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-600">{project.total_tasks}</span>
              <span className="text-slate-500">tasks completed</span>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getProgressColor(project.progress_percent)}`}
                  style={{ width: `${project.progress_percent}%` }}
                />
              </div>
            </div>

            {/* Percentage */}
            <div className="text-right text-sm font-semibold text-slate-900">
              {project.progress_percent}%
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProjectProgressSection
