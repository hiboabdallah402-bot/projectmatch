import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { listSupervisorProjects, reviewProject } from '../api/collaborationApi'

function SupervisorPage() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [isSupervisor, setIsSupervisor] = useState(null)

  const reviewBadgeClass = (status) => {
    if (status === 'approved') return 'border-emerald-300 bg-emerald-50 text-emerald-700'
    if (status === 'rejected') return 'border-rose-300 bg-rose-50 text-rose-700'
    return 'border-amber-300 bg-amber-50 text-amber-700'
  }

  const loadSupervisorProjects = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const data = await listSupervisorProjects()
      setProjects(data)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to load supervisor panel.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('projectmatch_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const meResponse = await axiosClient.get('/api/auth/me')
        const supervisorFlag = Boolean(meResponse.data?.user?.is_supervisor)
        setIsSupervisor(supervisorFlag)

        if (supervisorFlag) {
          await loadSupervisorProjects()
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        setIsSupervisor(false)
        setErrorMessage(error?.response?.data?.message || 'Unable to verify supervisor access.')
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isSupervisor === false) {
    return <Navigate to="/app" replace />
  }

  const handleDecision = async (projectId, decision) => {
    try {
      await reviewProject(projectId, decision)
      await loadSupervisorProjects()
      setActionMessage(`Project ${decision === 'approve' ? 'approved' : 'rejected'}.`)
      window.setTimeout(() => setActionMessage(''), 2000)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to update review decision.')
    }
  }

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Supervisor
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Supervisor panel</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Review all projects, approve or reject submissions, and monitor platform status.
        </p>
      </header>

      {errorMessage ? <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div> : null}
      {actionMessage ? <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{actionMessage}</div> : null}
      {isLoading ? <p className="text-sm text-slate-600">Loading supervisor projects...</p> : null}

      <div className="grid gap-3">
        {projects.map((project) => (
          <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{project.title}</p>
                <p className="text-xs text-slate-500">Owner #{project.owner_id}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    {project.status}
                  </span>
                  <span className={["rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]", reviewBadgeClass(project.review_status)].join(' ')}>
                    {project.review_status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDecision(project.id, 'approve')}
                  disabled={project.review_status === 'approved'}
                  className="rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-200 disabled:text-emerald-300"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision(project.id, 'reject')}
                  disabled={project.review_status === 'rejected'}
                  className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:cursor-not-allowed disabled:border-rose-200 disabled:text-rose-300"
                >
                  Reject
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default SupervisorPage
