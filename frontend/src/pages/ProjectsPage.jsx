import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { Plus, Search, Filter, MoreVertical, Trash2, Eye, AlertCircle, FolderOpen } from 'lucide-react'

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
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const successMessage = location.state?.successMessage || ''

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.trim().toLowerCase()
    const titleText = String(project.title || '').toLowerCase()
    const descText = String(project.description || '').toLowerCase()
    const matchesSearch = !query || titleText.includes(query) || descText.includes(query)
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true)
      setErrorMessage('')
      try {
        const [projectsResponse, userResponse] = await Promise.all([
          axiosClient.get('/api/projects'),
          axiosClient.get('/api/auth/me'),
        ])

        setProjects(Array.isArray(projectsResponse.data?.projects) ? projectsResponse.data.projects : [])
        setCurrentUserId(userResponse.data?.user?.id ?? null)
      } catch (error) {
        const message = error?.response?.data?.message || 'Unable to load projects.'
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [location.state?.refreshProjects])

  const handleDeleteProject = async (project) => {
    if (!project?.id) return
    const shouldDelete = window.confirm(`Delete project "${project.title || 'Untitled'}"?`)
    if (!shouldDelete) return

    setDeletingProjectId(project.id)
    setActionError('')
    try {
      await axiosClient.delete(`/api/projects/${project.id}`)
      setProjects((previous) => previous.filter((item) => item.id !== project.id))
      setActionSuccess('Project deleted successfully.')
      setOpenDropdownId(null)
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to delete project.'
      setActionError(message)
    } finally {
      setDeletingProjectId(null)
    }
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      open: 'bg-blue-50 text-blue-700 border-blue-200',
      in_progress: 'bg-purple-50 text-purple-700 border-purple-200',
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      closed: 'bg-gray-50 text-gray-700 border-gray-200',
    }
    const statusLabels = {
      open: 'Open',
      in_progress: 'In Progress',
      completed: 'Completed',
      closed: 'Closed',
    }
    const style = statusStyles[status] || statusStyles.open
    return (
      <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${style}`}>
        {statusLabels[status] || status}
      </span>
    )
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-gray-600">Manage and explore all projects</p>
        </div>
        <Link
          to="/app/projects/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Project
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 pl-10 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition"
              >
                <option value="all">All statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          ✓ {successMessage}
        </div>
      )}
      {actionSuccess && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          ✓ {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>{actionError}</div>
        </div>
      )}
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg border border-gray-200 bg-gray-50 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty States */}
      {!isLoading && errorMessage && (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-3 text-sm font-medium text-gray-900">Unable to load projects</p>
          <p className="mt-1 text-xs text-gray-500">{errorMessage}</p>
        </div>
      )}

      {!isLoading && !errorMessage && projects.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-3 text-sm font-medium text-gray-900">No projects yet</p>
          <p className="mt-1 text-xs text-gray-500">Create your first project to get started</p>
          <Link
            to="/app/projects/create"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </Link>
        </div>
      )}

      {!isLoading && !errorMessage && projects.length > 0 && filteredProjects.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-3 text-sm font-medium text-gray-900">No projects found</p>
          <p className="mt-1 text-xs text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !errorMessage && filteredProjects.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Team Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-sm">
                        <p className="font-semibold text-gray-900">{project.title}</p>
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{project.team_size || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {project.created_at ? new Date(project.created_at).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === project.id ? null : project.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </button>
                          {openDropdownId === project.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-10">
                              <button
                                onClick={() => {
                                  navigate(`/app/projects/${project.id}`)
                                  setOpenDropdownId(null)
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition border-b border-gray-100"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </button>
                              {currentUserId === project.owner_id && (
                                <>
                                  <Link
                                    to={`/app/projects/${project.id}/edit`}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition border-b border-gray-100"
                                  >
                                    Edit Project
                                  </Link>
                                  <button
                                    onClick={() => {
                                      handleDeleteProject(project)
                                      setOpenDropdownId(null)
                                    }}
                                    disabled={deletingProjectId === project.id}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    {deletingProjectId === project.id ? 'Deleting...' : 'Delete'}
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProjectsPage
