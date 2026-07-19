import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import ProjectCard from '../components/projects/ProjectCard'

function ProjectsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')
  const [deletingProjectId, setDeletingProjectId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [teamSizeFilter, setTeamSizeFilter] = useState('all')
  const successMessage = location.state?.successMessage || ''

  const teamSizeOptions = Array.from(
    new Set(projects.map((project) => Number(project.team_size)).filter((size) => Number.isInteger(size) && size > 0)),
  ).sort((a, b) => a - b)

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.trim().toLowerCase()
    const titleText = String(project.title || '').toLowerCase()
    const skillsText = String(project.required_skills || '').toLowerCase()
    const matchesSearch = !query || titleText.includes(query) || skillsText.includes(query)

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter

    const projectTeamSize = Number(project.team_size)
    const matchesTeamSize =
      teamSizeFilter === 'all' ||
      (Number.isInteger(projectTeamSize) && projectTeamSize === Number(teamSizeFilter))

    return matchesSearch && matchesStatus && matchesTeamSize
  })

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true)
      setErrorMessage('')
      setActionError('')
      setActionSuccess('')

      try {
        const [projectsResponse, userResponse] = await Promise.all([
          axiosClient.get('/api/projects'),
          axiosClient.get('/api/auth/me'),
        ])

        setProjects(Array.isArray(projectsResponse.data?.projects) ? projectsResponse.data.projects : [])
        setCurrentUserId(userResponse.data?.user?.id ?? null)
      } catch (error) {
        const message = error?.response?.data?.message || 'Unable to load projects at the moment.'
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [location.state?.refreshProjects])

  const handleDeleteProject = async (project) => {
    if (!project?.id) {
      return
    }

    const shouldDelete = window.confirm(`Delete project "${project.title || 'Untitled project'}"?`)
    if (!shouldDelete) {
      return
    }

    setDeletingProjectId(project.id)
    setActionError('')
    setActionSuccess('')

    try {
      await axiosClient.delete(`/api/projects/${project.id}`)
      setProjects((previous) => previous.filter((item) => item.id !== project.id))
      setActionSuccess('Project deleted successfully.')
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to delete project right now.'
      setActionError(message)
    } finally {
      setDeletingProjectId(null)
    }
  }

  const handleOpenDetails = (project) => {
    if (!project?.id) {
      return
    }

    navigate(`/app/projects/${project.id}`)
  }

  return (
    <section className="space-y-6">
      <header className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between sm:gap-4">
        <div className="space-y-3">
          <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Projects
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">View all projects</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Browse current projects published on ProjectMatch. Search and filter by status, team size, and required skills to quickly find relevant opportunities.
          </p>
        </div>

        <Link
          to="/app/projects/create"
          className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
        >
          Create project
        </Link>
      </header>

      <section className="grid gap-3 rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <label htmlFor="project-search" className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Search
          </label>
          <input
            id="project-search"
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search title or required skills"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status-filter" className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="team-size-filter" className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Team size
          </label>
          <select
            id="team-size-filter"
            value={teamSizeFilter}
            onChange={(event) => setTeamSizeFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="all">All sizes</option>
            {teamSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </section>

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {actionSuccess ? (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {actionSuccess}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {actionError}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-[1.75rem] border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage && projects.length === 0 ? (
        <div className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          No projects are available yet.
        </div>
      ) : null}

      {!isLoading && !errorMessage && projects.length > 0 && filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          No projects match your current search and filter criteria.
        </div>
      ) : null}

      {!isLoading && !errorMessage && filteredProjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              canManage={currentUserId === project.owner_id}
              onDelete={handleDeleteProject}
              isDeleting={deletingProjectId === project.id}
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default ProjectsPage
