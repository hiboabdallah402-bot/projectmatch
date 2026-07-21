import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function AnalyticsSection({ projects = [], applications = [], isLoading = false }) {
  const navigate = useNavigate()

  // Check if there's meaningful data
  const hasData = useMemo(() => {
    return (Array.isArray(projects) && projects.length > 0) ||
           (Array.isArray(applications) && applications.length > 0)
  }, [projects, applications])
  // Applications by Status
  const applicationsByStatus = useMemo(() => {
    if (!Array.isArray(applications) || applications.length === 0) {
      return [
        { name: 'Pending', value: 0 },
        { name: 'Accepted', value: 0 },
        { name: 'Rejected', value: 0 },
      ]
    }

    const pending = applications.filter((app) => app.status === 'Pending').length
    const accepted = applications.filter((app) => app.status === 'Accepted').length
    const rejected = applications.filter((app) => app.status === 'Rejected').length

    return [
      { name: 'Accepted', value: accepted },
      { name: 'Pending', value: pending },
      { name: 'Rejected', value: rejected },
    ].filter((item) => item.value > 0)
  }, [applications])

  // Projects by Status
  const projectsByStatus = useMemo(() => {
    if (!Array.isArray(projects) || projects.length === 0) {
      return [
        { name: 'Open', value: 0 },
        { name: 'Closed', value: 0 },
        { name: 'Completed', value: 0 },
      ]
    }

    const open = projects.filter((p) => p.status === 'open').length
    const closed = projects.filter((p) => p.status === 'closed').length
    const completed = projects.filter((p) => p.status === 'completed').length

    return [
      { name: 'Open', value: open },
      { name: 'Closed', value: closed },
      { name: 'Completed', value: completed },
    ].filter((item) => item.value > 0)
  }, [projects])

  // Applications Over Time (last 7 days simulation)
  const applicationsOverTime = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const today = new Date()

    return days.map((day, index) => {
      const dayDate = new Date(today)
      dayDate.setDate(dayDate.getDate() - (6 - index))

      // Count applications created on or before this day
      const count = applications.filter((app) => {
        if (!app.created_at) return false
        const appDate = new Date(app.created_at)
        return appDate <= dayDate
      }).length

      return {
        day,
        applications: count,
      }
    })
  }, [applications])

  const PIE_COLORS = ['#059669', '#f59e0b', '#ef4444']
  const BAR_COLORS = ['#059669', '#047857', '#065f46']

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="h-64 animate-pulse rounded bg-gray-100" />
        </div>
      </section>
    )
  }

  // Show empty state if no data
  if (!hasData) {
    return (
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12 text-center shadow-sm">
          <div className="mb-3 text-4xl">📈</div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">No activity yet</h3>
          <p className="mb-6 max-w-xs text-sm text-gray-500">
            Applications over time will appear after students start applying.
          </p>
          <button
            onClick={() => navigate('/app/projects/create')}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
          >
            Create Project
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
      </div>

      {/* Pie and Bar Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Applications by Status - Pie Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Applications by Status</h3>
          {applicationsByStatus.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-gray-500">
              No applications data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={applicationsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Projects by Status - Bar Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Projects by Status</h3>
          {projectsByStatus.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-gray-500">
              No projects data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={projectsByStatus}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Applications Over Time - Line Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Applications Over Time</h3>
        {applicationsOverTime.every((item) => item.applications === 0) ? (
          <div className="flex h-64 items-center justify-center text-sm text-gray-500">
            No application history available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={applicationsOverTime}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#059669"
                dot={{ fill: '#059669', r: 5 }}
                activeDot={{ r: 7 }}
                strokeWidth={2}
                name="Total Applications"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  )
}

export default AnalyticsSection
