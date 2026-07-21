import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { dispatchNotificationsChangeEvent } from '../utils/auth'
import {
  addTeamMember,
  createMeeting,
  createTask,
  deleteTask,
  generateReport,
  getProjectProgress,
  listAnnouncements,
  listMeetings,
  listMessages,
  listReports,
  listTasks,
  listTeamMembers,
  postAnnouncement,
  postMessage,
  removeTeamMember,
  seedProjectDemoData,
  updateTask,
  updateTeamMember,
} from '../api/collaborationApi'

const tabs = [
  { key: 'team', label: 'Team' },
  { key: 'tasks', label: 'Task Board' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'chat', label: 'Discussion' },
  { key: 'meetings', label: 'Meetings' },
  { key: 'reports', label: 'Reports' },
]

const roleOptions = ['Frontend Developer', 'Backend Developer', 'Designer', 'Tester', 'Project Manager', 'Contributor']

function formatDateTime(value) {
  if (!value) {
    return 'Unavailable'
  }

  return new Date(value).toLocaleString()
}

function TabSkeleton({ lines = 3, grid = false }) {
  if (grid) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

function ExampleCard({ title, items }) {
  return (
    <div className="rounded-2xl border border-dashed border-cyan-300 bg-cyan-50/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{title}</p>
      <div className="mt-2 space-y-2">
        {items.map((item, index) => (
          <p key={`${title}-${index}`} className="text-sm text-slate-700">
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}

function CollaborationPage() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('team')
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')

  const [teamMembers, setTeamMembers] = useState([])
  const [tasks, setTasks] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [messages, setMessages] = useState([])
  const [meetings, setMeetings] = useState([])
  const [reports, setReports] = useState([])
  const [progress, setProgress] = useState(null)

  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [isLoadingTab, setIsLoadingTab] = useState(false)
  const [isSeedingDemo, setIsSeedingDemo] = useState(false)

  const [newMemberUserId, setNewMemberUserId] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('Contributor')

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskAssignee, setNewTaskAssignee] = useState('')

  const [announcementText, setAnnouncementText] = useState('')
  const [chatText, setChatText] = useState('')

  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDateTime, setMeetingDateTime] = useState('')
  const [meetingLocation, setMeetingLocation] = useState('')

  const selectedProject = useMemo(
    () => projects.find((project) => String(project.id) === String(selectedProjectId)),
    [projects, selectedProjectId],
  )

  const examples = useMemo(
    () => ({
      team: [
        'Sarah Kim | Project Manager | Team Leader',
        'Ahmed Noor | Backend Developer',
        'Lina Park | Frontend Developer',
      ],
      tasks: [
        'Build authentication middleware | in_progress | Ahmed Noor',
        'Design dashboard UI cards | to_do | Lina Park',
        'Review API error handling | completed | Sarah Kim',
      ],
      announcements: [
        'Sprint 2 starts Monday at 9:00 AM. Please update task status today.',
        'API integration freeze on Friday 6:00 PM for testing and QA.',
      ],
      chat: [
        'Sarah: Please prioritize login error handling before new widgets.',
        'Ahmed: Token validation fix is pushed, please retest.',
        'Lina: I will update UI state for failed login responses.',
      ],
      meetings: [
        'Daily Standup | 2026-07-21 09:30 | Google Meet',
        'Sprint Planning | 2026-07-22 14:00 | Room B2 / Zoom',
        'Demo Review | 2026-07-25 16:00 | Teams',
      ],
      reports: [
        'Weekly Progress: 12 tasks, 8 completed, risk: upload API delay.',
        'Sprint Health: 24 points complete, 5 bugs found, 4 fixed.',
      ],
    }),
    [],
  )

  const activeTabCount = useMemo(() => {
    if (activeTab === 'team') return teamMembers.length
    if (activeTab === 'tasks') return tasks.length
    if (activeTab === 'announcements') return announcements.length
    if (activeTab === 'chat') return messages.length
    if (activeTab === 'meetings') return meetings.length
    if (activeTab === 'reports') return reports.length
    return 0
  }, [activeTab, announcements.length, meetings.length, messages.length, reports.length, tasks.length, teamMembers.length])

  const activeTabLabel = useMemo(() => tabs.find((tab) => tab.key === activeTab)?.label || 'Workspace', [activeTab])

  useEffect(() => {
    const loadProjectOptions = async () => {
      setIsLoadingProjects(true)
      setErrorMessage('')

      try {
        const [meResponse, projectsResponse, submittedResponse] = await Promise.all([
          axiosClient.get('/api/auth/me'),
          axiosClient.get('/api/projects'),
          axiosClient.get('/api/applications?scope=submitted'),
        ])

        const currentUserId = meResponse.data?.user?.id
        const allProjects = Array.isArray(projectsResponse.data?.projects) ? projectsResponse.data.projects : []
        const submittedApplications = Array.isArray(submittedResponse.data?.applications)
          ? submittedResponse.data.applications
          : []

        const ownedProjects = allProjects.filter((project) => Number(project.owner_id) === Number(currentUserId))
        const acceptedJoinedProjects = submittedApplications
          .filter((application) => application.status === 'Accepted' && application.project)
          .map((application) => ({
            id: application.project.id,
            title: application.project.title,
            owner_id: application.project.owner_id,
            status: application.project.status,
          }))

        const projectMap = new Map()
        ;[...ownedProjects, ...acceptedJoinedProjects].forEach((project) => {
          if (!projectMap.has(project.id)) {
            projectMap.set(project.id, project)
          }
        })

        const projectOptions = Array.from(projectMap.values())
        setProjects(projectOptions)

        const queryProject = searchParams.get('projectId')
        const queryTab = searchParams.get('tab')

        if (queryTab && tabs.some((tab) => tab.key === queryTab)) {
          setActiveTab(queryTab)
        }

        if (projectOptions.length > 0) {
          const hasQueryProject = queryProject && projectOptions.some((project) => String(project.id) === String(queryProject))
          setSelectedProjectId(String(hasQueryProject ? queryProject : projectOptions[0].id))
        }
      } catch (error) {
        const message = error?.response?.data?.message || 'Unable to load collaboration projects.'
        setErrorMessage(message)
      } finally {
        setIsLoadingProjects(false)
      }
    }

    loadProjectOptions()
  }, [searchParams])

  useEffect(() => {
    if (!selectedProjectId) {
      return
    }

    const loadTeamForCrossTabUse = async () => {
      try {
        const members = await listTeamMembers(selectedProjectId)
        setTeamMembers(members)
      } catch {
        setTeamMembers([])
      }
    }

    loadTeamForCrossTabUse()
  }, [selectedProjectId])

  const loadActiveTabData = async () => {
    if (!selectedProjectId) {
      return
    }

    setIsLoadingTab(true)
    setErrorMessage('')

    try {
      if (activeTab === 'team') {
        const data = await listTeamMembers(selectedProjectId)
        setTeamMembers(data)
      }

      if (activeTab === 'tasks') {
        const [taskData, progressData] = await Promise.all([
          listTasks(selectedProjectId),
          getProjectProgress(selectedProjectId),
        ])
        setTasks(taskData)
        setProgress(progressData)
      }

      if (activeTab === 'announcements') {
        const data = await listAnnouncements(selectedProjectId)
        setAnnouncements(data)
      }

      if (activeTab === 'chat') {
        const data = await listMessages(selectedProjectId)
        setMessages(data)
      }

      if (activeTab === 'meetings') {
        const data = await listMeetings(selectedProjectId)
        setMeetings(data)
      }

      if (activeTab === 'reports') {
        const data = await listReports(selectedProjectId)
        setReports(data)
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to load tab data.'
      setErrorMessage(message)
    } finally {
      setIsLoadingTab(false)
    }
  }

  useEffect(() => {
    loadActiveTabData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedProjectId])

  const showSuccess = (message) => {
    setSuccessMessage(message)
    window.setTimeout(() => setSuccessMessage(''), 2200)
  }

  const clearMessages = () => {
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleAddTeamMember = async () => {
    if (!newMemberUserId?.trim() || !selectedProjectId) {
      setErrorMessage('Please enter a valid user ID.')
      return
    }

    clearMessages()
    try {
      await addTeamMember(selectedProjectId, { user_id: Number(newMemberUserId), role: newMemberRole })
      setTeamMembers(await listTeamMembers(selectedProjectId))
      setNewMemberUserId('')
      showSuccess('Team member added.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to add team member.')
    }
  }

  const handleRemoveTeamMember = async (userId) => {
    clearMessages()
    try {
      await removeTeamMember(selectedProjectId, userId)
      setTeamMembers(await listTeamMembers(selectedProjectId))
      showSuccess('Team member removed.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to remove member.')
    }
  }

  const handleSetLeader = async (member) => {
    clearMessages()
    try {
      await updateTeamMember(selectedProjectId, member.user_id, { is_leader: !member.is_leader })
      setTeamMembers(await listTeamMembers(selectedProjectId))
      showSuccess('Team member updated.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to update team member.')
    }
  }

  const handleCreateTask = async () => {
    if (!newTaskTitle?.trim() || !selectedProjectId) {
      setErrorMessage('Task title is required.')
      return
    }

    clearMessages()
    try {
      await createTask(selectedProjectId, {
        title: newTaskTitle,
        description: newTaskDescription,
        assigned_to_user_id: newTaskAssignee ? Number(newTaskAssignee) : null,
      })
      const [taskData, progressData] = await Promise.all([
        listTasks(selectedProjectId),
        getProjectProgress(selectedProjectId),
      ])
      setTasks(taskData)
      setProgress(progressData)
      setNewTaskTitle('')
      setNewTaskDescription('')
      setNewTaskAssignee('')
      showSuccess('Task created.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to create task.')
    }
  }

  const handleTaskStatus = async (taskId, status) => {
    clearMessages()
    try {
      await updateTask(taskId, { status })
      const [taskData, progressData] = await Promise.all([
        listTasks(selectedProjectId),
        getProjectProgress(selectedProjectId),
      ])
      setTasks(taskData)
      setProgress(progressData)
      showSuccess('Task updated.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to update task.')
    }
  }

  const handleDeleteTask = async (taskId) => {
    clearMessages()
    try {
      await deleteTask(taskId)
      const [taskData, progressData] = await Promise.all([
        listTasks(selectedProjectId),
        getProjectProgress(selectedProjectId),
      ])
      setTasks(taskData)
      setProgress(progressData)
      showSuccess('Task deleted.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to delete task.')
    }
  }

  const handlePostAnnouncement = async () => {
    if (!announcementText.trim()) {
      return
    }

    clearMessages()
    try {
      await postAnnouncement(selectedProjectId, { content: announcementText.trim() })
      setAnnouncements(await listAnnouncements(selectedProjectId))
      setAnnouncementText('')
      showSuccess('Announcement posted.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to post announcement.')
    }
  }

  const handleSendMessage = async () => {
    if (!chatText.trim()) {
      return
    }

    clearMessages()
    try {
      await postMessage(selectedProjectId, { message: chatText.trim() })
      setMessages(await listMessages(selectedProjectId))
      setChatText('')
      showSuccess('Message sent.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to send message.')
    }
  }

  const handleCreateMeeting = async () => {
    if (!meetingTitle?.trim() || !meetingDateTime) {
      setErrorMessage('Meeting title and date/time are required.')
      return
    }

    clearMessages()
    try {
      await createMeeting(selectedProjectId, {
        title: meetingTitle,
        scheduled_for: new Date(meetingDateTime).toISOString(),
        location: meetingLocation,
      })
      setMeetings(await listMeetings(selectedProjectId))
      setMeetingTitle('')
      setMeetingDateTime('')
      setMeetingLocation('')
      showSuccess('Meeting scheduled.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to create meeting.')
    }
  }

  const handleGenerateReport = async () => {
    clearMessages()
    try {
      await generateReport(selectedProjectId)
      setReports(await listReports(selectedProjectId))
      showSuccess('Report generated.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to generate report.')
    }
  }

  const handleLoadDemoData = async () => {
    if (!selectedProjectId || isSeedingDemo) {
      return
    }

    clearMessages()
    setIsSeedingDemo(true)

    try {
      await seedProjectDemoData(selectedProjectId)
      await Promise.all([
        loadActiveTabData(),
        listTeamMembers(selectedProjectId).then(setTeamMembers).catch(() => setTeamMembers([])),
      ])
      dispatchNotificationsChangeEvent()
      showSuccess('Demo data loaded for this project.')
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to load demo data.'
      setErrorMessage(message)
    } finally {
      setIsSeedingDemo(false)
    }
  }

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Collaboration Workspace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Team collaboration center</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Manage your team, tasks, announcements, discussions, meetings, and reports from one place.
        </p>
      </header>

      {errorMessage ? <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div> : null}
      {successMessage ? <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{successMessage}</div> : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold text-slate-700" htmlFor="project-select">Active project</label>
            <select
              id="project-select"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              value={selectedProjectId}
              onChange={(event) => setSelectedProjectId(event.target.value)}
              disabled={isLoadingProjects || projects.length === 0}
            >
              {projects.length === 0 ? <option value="">No accessible projects</option> : null}
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadActiveTabData}
              disabled={!selectedProjectId || isLoadingTab}
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingTab ? 'Refreshing...' : 'Refresh'}
            </button>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              {activeTabCount} items
            </span>
          </div>
        </div>

        {selectedProject ? (
          <div className="mt-3 text-xs text-slate-500">
            Working in: <span className="font-semibold text-slate-700">{selectedProject.title}</span>
          </div>
        ) : null}
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Collaboration tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={[
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              activeTab === tab.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {selectedProject && !isLoadingTab && activeTabCount === 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-cyan-900">{activeTabLabel} is empty</p>
            <p className="text-sm text-cyan-800">
              Add your own records manually, or load demo content once to populate this project with realistic sample data.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLoadDemoData}
            disabled={!selectedProjectId || isSeedingDemo}
            className="rounded-xl border border-cyan-300 bg-white px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:border-cyan-400 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSeedingDemo ? 'Loading demo data...' : 'Load Demo Data'}
          </button>
        </div>
      ) : null}

      {!selectedProject && !isLoadingProjects ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          No accessible projects yet. Create a project from <Link to="/app/projects/create" className="font-semibold text-cyan-700">Create Project</Link> or get accepted into one.
        </div>
      ) : null}

      {selectedProject && activeTab === 'team' ? (
        isLoadingTab ? (
          <div className="space-y-4">
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
            </div>
            <TabSkeleton lines={3} />
          </div>
        ) : (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
            <input
              value={newMemberUserId}
              onChange={(event) => setNewMemberUserId(event.target.value)}
              placeholder="User ID"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              value={newMemberRole}
              onChange={(event) => setNewMemberRole(event.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <button type="button" onClick={handleAddTeamMember} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Add member</button>
          </div>

          {teamMembers.length === 0 ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">No team members have been added to this project yet.</div>
              <ExampleCard title="Suggested team structure" items={examples.team} />
            </div>
          ) : (
            <div className="grid gap-3">
              {teamMembers.map((member) => (
                <article key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{member.user?.full_name || `User #${member.user_id}`}</p>
                    <p className="text-xs text-slate-500">{member.role}{member.is_leader ? ' | Team Leader' : ''}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleSetLeader(member)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      {member.is_leader ? 'Unset leader' : 'Set leader'}
                    </button>
                    <button type="button" onClick={() => handleRemoveTeamMember(member.user_id)} className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700">
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        )
      ) : null}

      {selectedProject && activeTab === 'tasks' ? (
        isLoadingTab ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="h-4 w-1/4 animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
            </div>
            <TabSkeleton lines={3} />
          </div>
        ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Progress: {progress?.progress_percent ?? 0}%</p>
            <p className="mt-1 text-xs text-slate-600">
              Completed {progress?.tasks?.completed ?? 0} | In Progress {progress?.tasks?.in_progress ?? 0} | Remaining {progress?.tasks?.remaining ?? 0}
            </p>
          </div>
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
            <input value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="Task title" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <input value={newTaskDescription} onChange={(event) => setNewTaskDescription(event.target.value)} placeholder="Description" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <select value={newTaskAssignee} onChange={(event) => setNewTaskAssignee(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <option value="">Unassigned</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.user_id}>{member.user?.full_name || `User #${member.user_id}`}</option>
              ))}
            </select>
            <button type="button" onClick={handleCreateTask} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Create task</button>
          </div>

          {tasks.length === 0 ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">No tasks have been created for this project yet.</div>
              <ExampleCard title="Suggested task board" items={examples.tasks} />
            </div>
          ) : (
            <div className="grid gap-3">
              {tasks.map((task) => (
                <article key={task.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.assigned_to?.full_name || 'Unassigned'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['to_do', 'in_progress', 'completed'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleTaskStatus(task.id, status)}
                          className={[
                            'rounded-lg px-2.5 py-1 text-xs font-semibold',
                            task.status === status ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700',
                          ].join(' ')}
                        >
                          {status}
                        </button>
                      ))}
                      <button type="button" onClick={() => handleDeleteTask(task.id)} className="rounded-lg border border-rose-300 px-2.5 py-1 text-xs font-semibold text-rose-700">Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        )
      ) : null}

      {selectedProject && activeTab === 'announcements' ? (
        isLoadingTab ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="h-10 flex-1 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 w-20 animate-pulse rounded-xl bg-slate-100" />
            </div>
            <TabSkeleton lines={3} />
          </div>
        ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input value={announcementText} onChange={(event) => setAnnouncementText(event.target.value)} placeholder="Post announcement" className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <button type="button" onClick={handlePostAnnouncement} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Post</button>
          </div>
          {announcements.length === 0 ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">No announcements have been posted yet.</div>
              <ExampleCard title="Suggested announcements" items={examples.announcements} />
            </div>
          ) : (
            <div className="grid gap-3">
              {announcements.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-800">{item.content}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.created_at)}</p>
                </article>
              ))}
            </div>
          )}
        </div>
        )
      ) : null}

      {selectedProject && activeTab === 'chat' ? (
        isLoadingTab ? (
          <div className="space-y-4">
            <div className="max-h-80 space-y-2 overflow-auto rounded-2xl border border-slate-200 bg-white p-4">
              <TabSkeleton lines={3} />
            </div>
            <div className="flex gap-2">
              <div className="h-10 flex-1 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 w-20 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        ) : (
        <div className="space-y-4">
          <div className="max-h-80 space-y-2 overflow-auto rounded-2xl border border-slate-200 bg-white p-4">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">No discussion messages yet. Start the conversation below.</p>
                <ExampleCard title="Suggested discussion starters" items={examples.chat} />
              </div>
            ) : (
              messages.map((item) => (
                <article key={item.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-700">{item.sender?.full_name || 'Team member'}</p>
                  <p className="text-sm text-slate-800">{item.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.created_at)}</p>
                </article>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input value={chatText} onChange={(event) => setChatText(event.target.value)} placeholder="Write a message" className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <button type="button" onClick={handleSendMessage} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Send</button>
          </div>
        </div>
        )
      ) : null}

      {selectedProject && activeTab === 'meetings' ? (
        isLoadingTab ? (
          <div className="space-y-4">
            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
            </div>
            <TabSkeleton lines={4} grid />
          </div>
        ) : (
        <div className="space-y-4">
          <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
            <input value={meetingTitle} onChange={(event) => setMeetingTitle(event.target.value)} placeholder="Meeting title" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <input value={meetingDateTime} onChange={(event) => setMeetingDateTime(event.target.value)} type="datetime-local" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <input value={meetingLocation} onChange={(event) => setMeetingLocation(event.target.value)} placeholder="Location" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <button type="button" onClick={handleCreateMeeting} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Schedule</button>
          </div>
          {meetings.length === 0 ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">No meetings have been scheduled yet.</div>
              <ExampleCard title="Suggested meeting schedule" items={examples.meetings} />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {meetings.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-600">{formatDateTime(item.scheduled_for)}</p>
                  <p className="text-xs text-slate-500">{item.location || 'No location'}</p>
                </article>
              ))}
            </div>
          )}
        </div>
        )
      ) : null}

      {selectedProject && activeTab === 'reports' ? (
        isLoadingTab ? (
          <div className="space-y-4">
            <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-100" />
            <TabSkeleton lines={3} />
          </div>
        ) : (
        <div className="space-y-4">
          <button type="button" onClick={handleGenerateReport} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Generate report</button>
          {reports.length === 0 ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">No reports have been generated yet.</div>
              <ExampleCard title="Suggested report summaries" items={examples.reports} />
            </div>
          ) : (
            <div className="grid gap-3">
              {reports.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">Report #{item.id}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(item.created_at)}</p>
                  <pre className="mt-2 max-h-56 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(item.report_payload, null, 2)}</pre>
                </article>
              ))}
            </div>
          )}
        </div>
        )
      ) : null}
    </section>
  )
}

export default CollaborationPage
