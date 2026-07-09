import { useEffect, useState } from 'react'
import WelcomeCard from '../components/dashboard/WelcomeCard'
import UserProfileSummaryCard from '../components/dashboard/UserProfileSummaryCard'
import DashboardStatsSection from '../components/dashboard/DashboardStatsSection'
import RecentActivitySection from '../components/dashboard/RecentActivitySection'
import axiosClient from '../api/axiosClient'

function DashboardPage() {
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('')
  const [stats, setStats] = useState([])
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const [userResponse, projectsResponse, submittedAppsResponse, receivedAppsResponse] = await Promise.all([
          axiosClient.get('/api/auth/me'),
          axiosClient.get('/api/projects'),
          axiosClient.get('/api/applications?scope=submitted'),
          axiosClient.get('/api/applications?scope=received'),
        ])

        const currentUser = userResponse.data?.user || null
        const allProjects = Array.isArray(projectsResponse.data?.projects) ? projectsResponse.data.projects : []
        const submittedApps = Array.isArray(submittedAppsResponse.data?.applications) ? submittedAppsResponse.data.applications : []
        const receivedApps = Array.isArray(receivedAppsResponse.data?.applications) ? receivedAppsResponse.data.applications : []

        const ownedProjects = allProjects.filter((project) => Number(project.owner_id) === Number(currentUser?.id))

        const nextStats = [
          {
            title: 'Owned projects',
            value: String(ownedProjects.length),
            note: ownedProjects.length > 0 ? 'Projects you currently manage.' : 'Create your first project to start collaborating.',
          },
          {
            title: 'Applications received',
            value: String(receivedApps.length),
            note: receivedApps.length > 0 ? 'Incoming applications from students.' : 'No incoming applications yet.',
          },
          {
            title: 'Applications submitted',
            value: String(submittedApps.length),
            note: submittedApps.length > 0 ? 'Requests you submitted to other projects.' : 'No submitted applications yet.',
          },
        ]

        const projectActivities = ownedProjects.slice(0, 2).map((project) => ({
          id: `project-${project.id}`,
          title: `Project published: ${project.title || 'Untitled project'}`,
          description: `Status: ${project.status || 'unknown'} | Team size: ${project.team_size ?? 'N/A'}`,
        }))

        const applicationActivities = receivedApps.slice(0, 3).map((application) => ({
          id: `application-${application.id}`,
          title: `Application ${String(application.status || 'pending').toLowerCase()} for ${application.project?.title || `Project #${application.project_id}`}`,
          description: `Applicant: ${application.user?.full_name || `User #${application.user_id}`}`,
        }))

        setUser(currentUser)
        setUserName(currentUser?.full_name || '')
        setStats(nextStats)
        setActivities([...projectActivities, ...applicationActivities].slice(0, 5))
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
    <div className="space-y-6">
      <WelcomeCard userName={userName} isLoading={isLoading} />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_1.85fr]">
        <UserProfileSummaryCard
          user={user}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
        <DashboardStatsSection stats={stats} />
      </section>

      <RecentActivitySection activities={activities} />
    </div>
  )
}

export default DashboardPage
