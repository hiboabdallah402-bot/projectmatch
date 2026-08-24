import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import { dispatchNotificationsChangeEvent } from '../utils/auth'
import {
  addFileMetadata,
  addTeamMember,
  createMeeting,
  createReport,
  createTask,
  deleteTask,
  generateReport,
  getProjectProgress,
  listAnnouncements,
  listFiles,
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
  { key: 'files', label: 'Files' },
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
  const [files, setFiles] = useState([])
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
  const [meetingDescription, setMeetingDescription] = useState('')
  const [editingMeetingId, setEditingMeetingId] = useState(null)

  const [reportType, setReportType] = useState('Weekly Progress')
  const [reportContent, setReportContent] = useState('')

  const [fileName, setFileName] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [fileType, setFileType] = useState('')

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
    if (activeTab === 'files') return files.length
    return 0
  }, [activeTab, announcements.length, files.length, meetings.length, messages.length, reports.length, tasks.length, teamMembers.length])

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

        const currentUser = meResponse.data?.user
        const currentUserId = currentUser?.id
        const isSupervisor = currentUser?.is_supervisor
        const allProjects = Array.isArray(projectsResponse.data?.projects) ? projectsResponse.data.projects : []
        const submittedApplications = Array.isArray(submittedResponse.data?.applications)
          ? submittedResponse.data.applications
          : []

        // Get user's owned projects (for everyone - supervisors and regular users)
        const ownedProjects = allProjects.filter((project) => Number(project.owner_id) === Number(currentUserId))

        let projectOptions = []

        if (isSupervisor) {
          // Supervisors see ALL active/open projects
          projectOptions = allProjects.filter((project) => project.status === 'open' || project.status === 'in_progress')
        } else {
          // Normal users see only their owned projects and accepted joined projects
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

          projectOptions = Array.from(projectMap.values())
        }

        setProjects(projectOptions)

        const queryProject = searchParams.get('projectId')
        const queryTab = searchParams.get('tab')

        if (queryTab && tabs.some((tab) => tab.key === queryTab)) {
          setActiveTab(queryTab)
        }

        if (projectOptions.length > 0) {
          let defaultProjectId = projectOptions[0].id
          
          // Prioritize owned projects as default (for all users, including supervisors)
          if (ownedProjects.length > 0) {
            defaultProjectId = ownedProjects[0].id
          }
          
          // Use query parameter if valid and in accessible projects, otherwise use default
          let selectedId = defaultProjectId
          if (queryProject) {
            const hasQueryProject = projectOptions.some((project) => String(project.id) === String(queryProject))
            if (hasQueryProject) {
              selectedId = queryProject
            }
          }
          
          setSelectedProjectId(String(selectedId))
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

      if (activeTab === 'files') {
        const data = await listFiles(selectedProjectId)
        setFiles(data)
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
      if (editingMeetingId) {
        // Update mode
        await axiosClient.patch(`/api/collaboration/meetings/${editingMeetingId}`, {
          title: meetingTitle,
          description: meetingDescription,
          scheduled_for: new Date(meetingDateTime).toISOString(),
          location: meetingLocation,
        })
        showSuccess('Meeting updated.')
        setEditingMeetingId(null)
      } else {
        // Create mode
        await createMeeting(selectedProjectId, {
          title: meetingTitle,
          description: meetingDescription,
          scheduled_for: new Date(meetingDateTime).toISOString(),
          location: meetingLocation,
        })
        showSuccess('Meeting scheduled.')
      }
      setMeetings(await listMeetings(selectedProjectId))
      setMeetingTitle('')
      setMeetingDateTime('')
      setMeetingLocation('')
      setMeetingDescription('')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to create meeting.')
    }
  }

  const handleEditMeeting = (meeting) => {
    setEditingMeetingId(meeting.id)
    setMeetingTitle(meeting.title)
    setMeetingDescription(meeting.description || '')
    setMeetingLocation(meeting.location || '')
    const date = new Date(meeting.scheduled_for)
    setMeetingDateTime(date.toISOString().slice(0, 16))
  }

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) {
      return
    }
    clearMessages()
    try {
      await axiosClient.delete(`/api/collaboration/meetings/${meetingId}`)
      setMeetings(await listMeetings(selectedProjectId))
      showSuccess('Meeting deleted.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to delete meeting.')
    }
  }

  const clearMeetingForm = () => {
    setMeetingTitle('')
    setMeetingDateTime('')
    setMeetingLocation('')
    setMeetingDescription('')
    setEditingMeetingId(null)
  }

  const getMeetingStatus = (scheduledFor) => {
    const now = new Date()
    const meetingDate = new Date(scheduledFor)
    return meetingDate > now ? 'Upcoming' : 'Completed'
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

  const handleCreateCustomReport = async () => {
    if (!reportContent.trim()) {
      setErrorMessage('Please enter report content.')
      return
    }

    clearMessages()
    try {
      await createReport(selectedProjectId, {
        report_type: reportType,
        report_payload: {
          content: reportContent,
          created_date: new Date().toLocaleDateString(),
        },
      })
      setReports(await listReports(selectedProjectId))
      setReportType('Weekly Progress')
      setReportContent('')
      showSuccess('Report created successfully.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to create report.')
    }
  }

  const handleUploadFile = async () => {
    if (!fileName.trim() || !fileUrl.trim() || !fileType.trim()) {
      setErrorMessage('Please enter file name, URL, and type.')
      return
    }

    clearMessages()
    try {
      await addFileMetadata(selectedProjectId, {
        file_name: fileName,
        file_url: fileUrl,
        file_type: fileType,
      })
      setFiles(await listFiles(selectedProjectId))
      setFileName('')
      setFileUrl('')
      setFileType('')
      showSuccess('File uploaded successfully.')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to upload file.')
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
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">No tasks have been created for this project yet.</div>
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
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">No announcements have been posted yet.</div>
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
              <div className="flex h-48 items-center justify-center">
                <p className="text-sm text-slate-500">No discussion messages yet. Start the conversation below.</p>
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
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-slate-900">{editingMeetingId ? 'Edit Meeting' : 'Schedule New Meeting'}</p>
            <div className="space-y-3">
              <input value={meetingTitle} onChange={(event) => setMeetingTitle(event.target.value)} placeholder="Meeting title *" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <input value={meetingDateTime} onChange={(event) => setMeetingDateTime(event.target.value)} type="datetime-local" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <input value={meetingLocation} onChange={(event) => setMeetingLocation(event.target.value)} placeholder="Location or meeting link" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <textarea value={meetingDescription} onChange={(event) => setMeetingDescription(event.target.value)} placeholder="Meeting agenda/description" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" rows="3" />
              <div className="flex gap-2">
                <button type="button" onClick={handleCreateMeeting} className="flex-1 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700">{editingMeetingId ? 'Update Meeting' : 'Schedule Meeting'}</button>
                {editingMeetingId && (
                  <button type="button" onClick={clearMeetingForm} className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                )}
              </div>
            </div>
          </div>
          {meetings.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">No meetings have been scheduled yet.</div>
          ) : (
            <div className="grid gap-3">
              {meetings.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getMeetingStatus(item.scheduled_for) === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                          {getMeetingStatus(item.scheduled_for)}
                        </span>
                      </div>
                      {item.description && <p className="mt-2 text-xs text-slate-700">{item.description}</p>}
                      <div className="mt-2 space-y-1 text-xs text-slate-600">
                        <p>📅 {formatDateTime(item.scheduled_for)}</p>
                        {item.location && <p>📍 {item.location}</p>}
                        {item.created_by && <p>Created by: {item.created_by.full_name}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEditMeeting(item)} className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                      <button type="button" onClick={() => handleDeleteMeeting(item.id)} className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  </div>
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
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900 mb-3">Create New Report</p>
            <div className="space-y-3">
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Weekly Progress">Weekly Progress</option>
                <option value="Sprint Health">Sprint Health</option>
                <option value="Technical Update">Technical Update</option>
                <option value="Risk Assessment">Risk Assessment</option>
                <option value="Architecture Review">Architecture Review</option>
                <option value="Custom">Custom</option>
              </select>
              <textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="Enter report content..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none resize-none"
                rows="4"
              />
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={handleCreateCustomReport}
                  className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
                >
                  Create Report
                </button>
                <button 
                  type="button" 
                  onClick={handleGenerateReport}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Generate Auto Report
                </button>
              </div>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
              <p>No reports have been generated yet. Click "Create Report" to create one.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {reports.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.report_type}</p>
                        <p className="text-xs text-slate-500">{formatDateTime(item.created_at)}</p>
                      </div>
                    </div>
                    <div className="space-y-2 rounded-xl bg-slate-50 p-3">
                      {typeof item.report_payload === 'object' && item.report_payload ? (
                        Object.entries(item.report_payload).map(([key, value]) => (
                          <div key={key} className="border-b border-slate-200 pb-2 last:border-b-0">
                            <p className="text-xs font-semibold uppercase text-slate-600">{key.replace(/_/g, ' ')}</p>
                            <p className="text-sm text-slate-800">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-700">{String(item.report_payload)}</p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        )
      ) : null}

      {selectedProject && activeTab === 'files' ? (
        isLoadingTab ? (
          <div className="space-y-4">
            <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-100" />
            <TabSkeleton lines={3} />
          </div>
        ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900 mb-3">Upload New File</p>
            <div className="space-y-3">
              <input 
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="File name (e.g., api-contract.pdf)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none"
              />
              <input 
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                placeholder="File type (e.g., pdf, xlsx, docx, png)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none"
              />
              <input 
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="File URL (e.g., https://example.com/files/document.pdf)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none"
              />
              <button 
                type="button" 
                onClick={handleUploadFile}
                className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Upload File
              </button>
            </div>
          </div>

          {files.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
              <p>No files have been uploaded yet.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {files.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <a 
                        href={item.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 break-words"
                      >
                        📄 {item.file_name}
                      </a>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-slate-500">
                          <span className="inline-block bg-slate-100 px-2 py-1 rounded">{item.file_type?.toUpperCase() || 'FILE'}</span>
                        </p>
                        <p className="text-xs text-slate-600">Uploaded {formatDateTime(item.uploaded_at)}</p>
                      </div>
                    </div>
                  </div>
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
