import { Link } from 'react-router-dom'

function ProjectCard({ project, canManage = false, onDelete, isDeleting = false, onOpenDetails }) {
  const requiredSkills = project.required_skills
    ? project.required_skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)
    : []

  const statusTone =
    project.status === 'open'
      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
      : project.status === 'in_progress'
        ? 'border-cyan-300 bg-cyan-50 text-cyan-700'
        : project.status === 'completed'
          ? 'border-slate-300 bg-slate-100 text-slate-700'
          : 'border-amber-300 bg-amber-50 text-amber-700'

  const handleCardOpen = (event) => {
    if (event.target.closest('a,button')) {
      return
    }

    onOpenDetails?.(project)
  }

  const handleCardKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    onOpenDetails?.(project)
  }

  return (
    <article
      className="flex h-full cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 focus-visible:border-cyan-400 focus-visible:ring-4 focus-visible:ring-cyan-100"
      role="button"
      tabIndex={0}
      onClick={handleCardOpen}
      onKeyDown={handleCardKeyDown}
      aria-label={`Open details for ${project.title || 'project'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          {project.title || 'Untitled project'}
        </h2>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusTone}`}>
          {project.status || 'unknown'}
        </span>
      </div>

      <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">
        {project.description || 'No description provided yet.'}
      </p>

      <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Team size</p>
          <p className="mt-1 font-medium text-slate-900">{project.team_size ?? 'N/A'}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Owner</p>
          <p className="mt-1 font-medium text-slate-900">{project.owner_id ? `Owner #${project.owner_id}` : 'Unknown owner'}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Required skills</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {requiredSkills.length > 0 ? (
            requiredSkills.map((skill) => (
              <span key={`${project.id}-${skill}`} className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-500">No skills listed</span>
          )}
        </div>
      </div>

      {canManage ? (
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Link
            to={`/app/projects/${project.id}/edit`}
            aria-label={`Edit ${project.title || 'project'}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete?.(project)}
            disabled={isDeleting}
            aria-label={`Delete ${project.title || 'project'}`}
            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ) : null}
    </article>
  )
}

export default ProjectCard
