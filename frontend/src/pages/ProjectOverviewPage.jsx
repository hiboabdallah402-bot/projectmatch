import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Calendar, BookOpen, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import axiosClient from '../api/axiosClient'
import { getAccessToken } from '../utils/auth'

function ProjectOverviewPage() {
  const { id: projectId } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [hasApplied, setHasApplied] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [applyMessage, setApplyMessage] = useState('')
  const [applyError, setApplyError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const isAuthenticated = Boolean(getAccessToken())

  useEffect(() => {
    const loadProjectData = async () => {
      setIsLoading(true)
      setErrorMessage('')
      setApplyMessage('')
      setApplyError('')

      try {
        // Load project data (public, no auth required)
        const projectResponse = await axiosClient.get(`/api/projects/${projectId}`)
        const projectData = projectResponse.data?.project

        if (!projectData) {
          setErrorMessage('Project not found.')
          setProject(null)
          return
        }

        setProject(projectData)

        // If authenticated, load user and check application status
        if (isAuthenticated) {
          try {
            const [userResponse, applicationsResponse] = await Promise.all([
              axiosClient.get('/api/auth/me'),
              axiosClient.get('/api/applications?scope=submitted'),
            ])

            const userData = userResponse.data?.user || null
            setCurrentUser(userData)

            // Check if already applied
            const submittedApplications = Array.isArray(applicationsResponse.data?.applications)
              ? applicationsResponse.data.applications
              : []

            const alreadyApplied = submittedApplications.some(
              (app) => Number(app.project_id) === Number(projectData.id),
            )
            setHasApplied(alreadyApplied)
          } catch (error) {
            console.error('Error loading user data:', error)
            // Continue without user data if auth call fails
          }
        }
      } catch (error) {
        const message = error?.response?.data?.message || 'Unable to load project details.'
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      loadProjectData()
    }
  }, [projectId, isAuthenticated])

  const handleApply = async () => {
    if (!project?.id || !canApply || isApplying) return

    setIsApplying(true)
    setApplyError('')
    setApplyMessage('')

    try {
      const response = await axiosClient.post('/api/applications', {
        project_id: project.id,
      })

      setHasApplied(true)
      setApplyMessage(response.data?.message || 'Application submitted successfully!')
      setTimeout(() => setApplyMessage(''), 5000)
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to submit application.'
      setApplyError(message)

      // If already applied, update state
      if (error?.response?.status === 409) {
        setHasApplied(true)
      }
    } finally {
      setIsApplying(false)
    }
  }

  // Derived state
  const isOwner = isAuthenticated && currentUser && Number(project?.owner_id) === Number(currentUser.id)
  const isProjectOpen = project?.status === 'open'
  const canApply = isAuthenticated && !isOwner && isProjectOpen && !hasApplied

  const requiredSkills = project?.required_skills
    ? project.required_skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  const createdAtLabel = project?.created_at
    ? new Date(project.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown'

  const getStatusColor = (status) => {
    const colors = {
      open: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Open' },
      in_progress: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', label: 'In Progress' },
      completed: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Completed' },
      closed: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', label: 'Closed' },
    }
    return colors[status] || colors.open
  }

  const statusColor = project ? getStatusColor(project.status) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="space-y-6 px-6 py-8 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              <div className="h-10 w-2/3 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-24 animate-pulse rounded-lg bg-slate-200" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-200" />
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {!isLoading && errorMessage && (
            <div className="space-y-3 rounded-2xl border border-rose-300 bg-rose-50 px-6 py-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-rose-700">{errorMessage}</p>
                  <p className="mt-1 text-sm text-rose-600">Try going back and selecting a different project.</p>
                </div>
              </div>
              <Link to="/explore" className="inline-flex text-sm font-medium text-rose-700 hover:text-rose-800 underline">
                Return to Explore
              </Link>
            </div>
          )}

          {/* Project Details */}
          {!isLoading && !errorMessage && project && (
            <article className="space-y-6">
              {/* Project Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">{project.title || 'Untitled Project'}</h1>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-block rounded-full border px-4 py-2 text-sm font-semibold ${statusColor.bg} ${statusColor.border} ${statusColor.text}`}>
                    {statusColor.label}
                  </span>
                  {isOwner && (
                    <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                      Your Project
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-600">Description</h2>
                  <p className="text-base leading-7 text-slate-700">{project.description || 'No description provided.'}</p>
                </div>
              </div>

              {/* Project Info Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Team Size</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{project.team_size ?? 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Created</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">{createdAtLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Project ID</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">#{project.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              {requiredSkills.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-600">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {requiredSkills.map((skill) => (
                      <span key={skill} className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Section */}
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-900">Join This Project</h2>

                {applyMessage && (
                  <div className="flex gap-3 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-emerald-700">{applyMessage}</p>
                  </div>
                )}

                {applyError && (
                  <div className="flex gap-3 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3">
                    <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-rose-700">{applyError}</p>
                  </div>
                )}

                {!isAuthenticated ? (
                  <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">Log in to apply.</span> You need to be authenticated to submit an application for this project.
                    </p>
                    <Link
                      to="/login"
                      state={{ from: { pathname: `/projects/${projectId}` } }}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
                    >
                      Go to Login
                    </Link>
                  </div>
                ) : isOwner ? (
                  <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm font-medium text-blue-700">You are the project owner.</p>
                    <p className="text-sm text-blue-600">Project owners cannot apply to their own projects. You can manage applications and team members in your dashboard.</p>
                    <Link
                      to="/app/projects"
                      className="inline-flex text-sm font-medium text-blue-700 hover:text-blue-800 underline"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                ) : !isProjectOpen ? (
                  <div className="space-y-3 rounded-lg border border-slate-300 bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">Applications are closed.</p>
                    <p className="text-sm text-slate-600">This project is no longer accepting applications. The current status is "{statusColor.label}".</p>
                  </div>
                ) : hasApplied ? (
                  <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <p className="text-sm font-medium text-emerald-700">Application submitted.</p>
                    </div>
                    <p className="text-sm text-emerald-600">Your application is pending review. The project owner will notify you once they make a decision.</p>
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-indigo-400"
                  >
                    {isApplying ? 'Submitting Application...' : 'Apply to Join'}
                  </button>
                )}
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Projects
                </Link>
              </div>
            </article>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProjectOverviewPage
