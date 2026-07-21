import { useEffect, useState } from 'react'
import WelcomeCard from '../components/dashboard/WelcomeCard'
import UserProfileSummaryCard from '../components/dashboard/UserProfileSummaryCard'
import DashboardStatsSection from '../components/dashboard/DashboardStatsSection'
import AnalyticsSection from '../components/dashboard/AnalyticsSection'
import QuickActions from '../components/dashboard/QuickActions'
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines'
import ProjectProgress from '../components/dashboard/ProjectProgress'
import NotificationsWidget from '../components/dashboard/NotificationsWidget'
import CollaborationPreview from '../components/dashboard/CollaborationPreview'
import RecentActivitySection from '../components/dashboard/RecentActivitySection'
import axiosClient from '../api/axiosClient'

function DashboardPage() {
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('')
  const [stats, setStats] = useState([])
  const [activities, setActivities] = useState([])
  const [projects, setProjects] = useState([])
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = localStorage.getItem('projectmatch_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const [userResponse, dashboardResponse] = await Promise.all([
          axiosClient.get('/api/auth/me'),
          axiosClient.get('/api/dashboard/stats'),
        ])

        const currentUser = userResponse.data?.user || null
        const dashboardStats = dashboardResponse.data || {}

        const nextStats = [
          {
            title: 'Owned projects',
            value: String(dashboardStats.projects_owned || 0),
            note: dashboardStats.projects_owned > 0 ? 'Projects you currently manage.' : 'Create your first project to start collaborating.',
          },
          {
            title: 'Applications received',
            value: String(dashboardStats.applications_received || 0),
            note: dashboardStats.applications_received > 0 ? 'Incoming applications from students.' : 'No incoming applications yet.',
          },
          {
            title: 'Applications submitted',
            value: String(dashboardStats.applications_submitted || 0),
            note: dashboardStats.applications_submitted > 0 ? 'Requests you submitted to other projects.' : 'No submitted applications yet.',
          },
        ]

        setUser(currentUser)
        setUserName(currentUser?.full_name || '')
        setStats(nextStats)
        setActivities(dashboardStats.recent_activities || [])
        setProjects(dashboardStats.projects || [])
        setApplications(dashboardStats.applications || [])
      } catch (error) {
        const message = error?.response?.data?.message || 'Unable to load your profile details right now.'
        setErrorMessage(message)
        setStats([
          {
            title: 'Owned projects',
            value: '--',
            note: 'Unavailable right now.',
          },
          {
            title: 'Applications received',
            value: '--',
            note: 'Unavailable right now.',
          },
          {
            title: 'Applications submitted',
            value: '--',
            note: 'Unavailable right now.',
          },
        ])
        setActivities([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCurrentUser()
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <WelcomeCard userName={userName} isLoading={isLoading} />

      {/* Profile + Statistics */}
      <section className="grid gap-5 xl:grid-cols-[1.15fr_1.85fr]">
        <UserProfileSummaryCard
          user={user}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
        <DashboardStatsSection stats={stats} />
      </section>

      {/* Analytics */}
      <AnalyticsSection projects={projects} applications={applications} isLoading={isLoading} />

      {/* Quick Actions + Upcoming Deadlines */}
      <section className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <UpcomingDeadlines projects={projects} isLoading={isLoading} />
      </section>

      {/* Project Progress + Notifications */}
      <section className="grid gap-6 lg:grid-cols-2">
        <ProjectProgress projects={projects} isLoading={isLoading} />
        <NotificationsWidget isLoading={isLoading} />
      </section>

      {/* Collaboration Preview */}
      <CollaborationPreview projects={projects} isLoading={isLoading} />

      {/* Recent Activity */}
      <RecentActivitySection activities={activities} />
    </div>
  )
}

export default DashboardPage
