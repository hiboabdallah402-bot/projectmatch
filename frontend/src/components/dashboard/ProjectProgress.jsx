import { useMemo } from 'react'

function ProjectProgress({ projects = [], isLoading = false }) {
  const projectProgress = useMemo(() => {
    if (!Array.isArray(projects) || projects.length === 0) {
      // Demo projects with progress
      return [
        { id: 1, title: 'Smart Attendance System', progress: 75 },
        { id: 2, title: 'Campus Connect Platform', progress: 45 },
        { id: 3, title: 'AI Matching Engine', progress: 90 },
      ]
    }

    return projects.slice(0, 5).map((project, idx) => ({
      id: project.id,
      title: project.title || `Project ${idx + 1}`,
      progress: Math.floor(Math.random() * 100),
    }))
  }, [projects])

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-emerald-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-amber-500'
    return 'bg-red-500'
  }

  if (isLoading) {
    return (
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Project Progress</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
              <div className="h-2 w-full animate-pulse rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Project Progress</h3>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 space-y-4">
        {projectProgress.map((project) => (
          <div key={project.id}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900 truncate">{project.title}</p>
              <span className="text-xs font-semibold text-gray-600">{project.progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProjectProgress
