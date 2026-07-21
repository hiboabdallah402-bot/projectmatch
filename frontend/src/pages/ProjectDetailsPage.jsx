import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosClient from '../api/axiosClient'

function ProjectDetailsPage() {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [hasApplied, setHasApplied] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [applySuccessMessage, setApplySuccessMessage] = useState('')
  const [applyErrorMessage, setApplyErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true)
      setErrorMessage('')
      setApplySuccessMessage('')
      setApplyErrorMessage('')
      setHasApplied(false)

      try {
        const [projectResponse, profileResponse, applicationsResponse] = await Promise.all([
          axiosClient.get(`/api/projects/${projectId}`),
          axiosClient.get('/api/auth/me'),
          axiosClient.get('/api/applications?scope=submitted'),
        ])

        const currentUser = profileResponse.data?.user || null
        const submittedApplications = Array.isArray(applicationsResponse.data?.applications)
          ? applicationsResponse.data.applications
          : []

        const selectedProject = projectResponse.data?.project || null
        const alreadyApplied = submittedApplications.some(
          (application) => Number(application.project_id) === Number(selectedProject?.id),
        )

        setProject(selectedProject)
        setCurrentUserId(currentUser?.id ?? null)
        setHasApplied(alreadyApplied)
      } catch (error) {
        const message = error?.response?.data?.message || 'Unable to load project details right now.'
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  const requiredSkills = project?.required_skills
    ? project.required_skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)
    : []

  const createdAtLabel = project?.created_at
    ? new Date(project.created_at).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unavailable'

  const isLoggedIn = Boolean(currentUserId)
  const isOwner = isLoggedIn && Number(project?.owner_id) === Number(currentUserId)
  const isProjectOpen = project?.status === 'open'
  const canApply = isLoggedIn && !isOwner && isProjectOpen && !hasApplied

  const handleApply = async () => {
    if (!project?.id || !canApply || isApplying) {
      return
    }

    setIsApplying(true)
    setApplyErrorMessage('')
    setApplySuccessMessage('')

    try {
      const response = await axiosClient.post('/api/applications', {
        project_id: project.id,
      })

      setHasApplied(true)
      setApplySuccessMessage(response.data?.message || 'Application submitted.')
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to submit your application right now.'
      const statusCode = error?.response?.status

      if (statusCode === 409 || message.toLowerCase().includes('already applied')) {
        setHasApplied(true)
      }

      setApplyErrorMessage(message)
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Projects
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Project details</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          View complete information for a selected project.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="h-8 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage && project ? (
        <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {project.title || 'Untitled project'}
            </h2>
            <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
              {project.status || 'unknown'}
            </span>
          </div>

          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            {project.description || 'No description provided yet.'}
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Project ID</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{project.id}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Owner</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{project.owner_id ? `Owner #${project.owner_id}` : 'Unknown owner'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Team size</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{project.team_size ?? 'N/A'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Created</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{createdAtLabel}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Required skills</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {requiredSkills.length > 0 ? (
                requiredSkills.map((skill) => (
                  <span
                    key={`${project.id}-${skill}`}
                    className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">No skills listed</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/app/projects"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Back to projects
            </Link>
            <Link
              to={`/app/collaboration?projectId=${project.id}&tab=tasks`}
              className="inline-flex items-center justify-center rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:border-cyan-400 hover:bg-cyan-100"
            >
              Open collaboration
            </Link>
            <Link
              to={`/app/projects/${project.id}/edit`}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Edit project
            </Link>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Apply to project</p>

            {applySuccessMessage ? (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                {applySuccessMessage}
              </div>
            ) : null}

            {applyErrorMessage ? (
              <div className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                {applyErrorMessage}
              </div>
            ) : null}

            {hasApplied ? (
              <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                Application Submitted
              </span>
            ) : null}

            {!hasApplied && canApply ? (
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplying}
                className="inline-flex items-center justify-center rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
              >
                {isApplying ? 'Submitting application...' : 'Apply to Project'}
              </button>
            ) : null}

            {!hasApplied && !canApply ? (
              <p className="text-sm text-slate-600">
                {!isLoggedIn
                  ? 'Login is required to apply.'
                  : isOwner
                    ? 'You cannot apply to your own project.'
                    : !isProjectOpen
                      ? 'Applications are only allowed while the project status is open.'
                      : 'Application cannot be submitted right now.'}
              </p>
            ) : null}
          </div>
        </article>
      ) : null}
    </section>
  )
}

export default ProjectDetailsPage
