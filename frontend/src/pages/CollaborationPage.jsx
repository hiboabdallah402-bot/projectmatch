import { useEffect, useMemo, useState } from 'react'
import axiosClient from '../api/axiosClient'
import {
  addFileMetadata,
  addTeamMember,
  createMeeting,
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
  updateTask,
  updateTeamMember,
} from '../api/collaborationApi'

const tabs = [
  { key: 'team', label: 'Team' },
  { key: 'tasks', label: 'Task Board' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'chat', label: 'Discussion' },
  { key: 'files', label: 'Files' },
  { key: 'meetings', label: 'Meetings' },
  { key: 'reports', label: 'Reports' },
]

const roleOptions = ['Frontend Developer', 'Backend Developer', 'Designer', 'Tester', 'Project Manager', 'Contributor']

function CollaborationPage() {
  const [activeTab, setActiveTab] = useState('team')
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [teamMembers, setTeamMembers] = useState([])
  const [tasks, setTasks] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [messages, setMessages] = useState([])
  const [files, setFiles] = useState([])
  const [meetings, setMeetings] = useState([])
  const [reports, setReports] = useState([])
  const [progress, setProgress] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [newMemberUserId, setNewMemberUserId] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('Contributor')

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskAssignee, setNewTaskAssignee] = useState('')

  const [announcementText, setAnnouncementText] = useState('')
  const [chatText, setChatText] = useState('')

  const [fileName, setFileName] = useState('')
  const [fileType, setFileType] = useState('')
  const [fileUrl, setFileUrl] = useState('')

  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDateTime, setMeetingDateTime] = useState('')
  const [meetingLocation, setMeetingLocation] = useState('')

  const selectedProject = useMemo(
    () => projects.find((project) => String(project.id) === String(selectedProjectId)),
    [projects, selectedProjectId],
  )

  useEffect(() => {
    const loadProjectOptions = async () => {
      setIsLoading(true)
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

        if (projectOptions.length > 0) {
          setSelectedProjectId(String(projectOptions[0].id))
        }
      } catch (error) {
        const message = error?.response?.data?.message || 'Unable to load collaboration projects.'
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjectOptions()
  }, [])

  useEffect(() => {
    if (!selectedProjectId) {
      return
    }

    const loadTabData = async () => {
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

        if (activeTab === 'files') {
          const data = await listFiles(selectedProjectId)
          setFiles(data)
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
      }
    }

    loadTabData()
  }, [activeTab, selectedProjectId])

  const showSuccess = (message) => {
    setSuccessMessage(message)
    window.setTimeout(() => setSuccessMessage(''), 2000)
  }

  const handleAddTeamMember = async () => {
    if (!newMemberUserId || !selectedProjectId) {
      return
    }

    try {
      await addTeamMember(selectedProjectId, { user_id: Number(newMemberUserId), role: newMemberRole })
      setTeamMembers(await listTeamMembers(selectedProjectId))
      setNewMemberUserId('')
      showSuccess('Team member added')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to add team member.')
    }
  }

  const handleRemoveTeamMember = async (userId) => {
    try {
      await removeTeamMember(selectedProjectId, userId)
      setTeamMembers(await listTeamMembers(selectedProjectId))
      showSuccess('Team member removed')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to remove member.')
    }
  }

  const handleSetLeader = async (member) => {
    try {
      await updateTeamMember(selectedProjectId, member.user_id, { is_leader: !member.is_leader })
      setTeamMembers(await listTeamMembers(selectedProjectId))
      showSuccess('Team member updated')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to update team member.')
    }
  }

  const handleCreateTask = async () => {
    if (!newTaskTitle || !selectedProjectId) {
      return
    }

    try {
      await createTask(selectedProjectId, {
        title: newTaskTitle,
        description: newTaskDescription,
        assigned_to_user_id: newTaskAssignee ? Number(newTaskAssignee) : null,
      })
      setTasks(await listTasks(selectedProjectId))
      setProgress(await getProjectProgress(selectedProjectId))
      setNewTaskTitle('')
      setNewTaskDescription('')
      setNewTaskAssignee('')
      showSuccess('Task created')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to create task.')
    }
  }

  const handleTaskStatus = async (taskId, status) => {
    try {
      await updateTask(taskId, { status })
      setTasks(await listTasks(selectedProjectId))
      setProgress(await getProjectProgress(selectedProjectId))
      showSuccess('Task updated')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to update task.')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId)
      setTasks(await listTasks(selectedProjectId))
      setProgress(await getProjectProgress(selectedProjectId))
      showSuccess('Task deleted')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to delete task.')
    }
  }

  const handlePostAnnouncement = async () => {
    if (!announcementText.trim()) {
      return
    }

    try {
      await postAnnouncement(selectedProjectId, { content: announcementText.trim() })
      setAnnouncements(await listAnnouncements(selectedProjectId))
      setAnnouncementText('')
      showSuccess('Announcement posted')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to post announcement.')
    }
  }

  const handleSendMessage = async () => {
    if (!chatText.trim()) {
      return
    }

    try {
      await postMessage(selectedProjectId, { message: chatText.trim() })
      setMessages(await listMessages(selectedProjectId))
      setChatText('')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to send message.')
    }
  }

  const handleAddFile = async () => {
    if (!fileName || !fileType || !fileUrl) {
      return
    }

    try {
      await addFileMetadata(selectedProjectId, {
        file_name: fileName,
        file_type: fileType,
        file_url: fileUrl,
      })
      setFiles(await listFiles(selectedProjectId))
      setFileName('')
      setFileType('')
      setFileUrl('')
      showSuccess('File metadata saved')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to save file metadata.')
    }
  }

  const handleCreateMeeting = async () => {
    if (!meetingTitle || !meetingDateTime) {
      return
    }

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
      showSuccess('Meeting scheduled')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to create meeting.')
    }
  }

  const handleGenerateReport = async () => {
    try {
      await generateReport(selectedProjectId)
      setReports(await listReports(selectedProjectId))
      showSuccess('Report generated')
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to generate report.')
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
          Manage your team, tasks, announcements, discussions, files, meetings, and reports from one page.
        </p>
      </header>

      {errorMessage ? <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div> : null}
      {successMessage ? <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{successMessage}</div> : null}

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold text-slate-700" htmlFor="project-select">Project</label>
        <select
          id="project-select"
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
          value={selectedProjectId}
          onChange={(event) => setSelectedProjectId(event.target.value)}
          disabled={isLoading || projects.length === 0}
        >
          {projects.length === 0 ? <option value="">No accessible projects</option> : null}
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.title}</option>
          ))}
        </select>
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

      {!selectedProject ? <p className="text-sm text-slate-600">Select a project to continue.</p> : null}

      {selectedProject && activeTab === 'team' ? (
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
          <div className="grid gap-3">
            {teamMembers.map((member) => (
              <article key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{member.user?.full_name || `User #${member.user_id}`}</p>
                  <p className="text-xs text-slate-500">{member.role} {member.is_leader ? '| Team Leader' : ''}</p>
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
        </div>
      ) : null}

      {selectedProject && activeTab === 'tasks' ? (
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
        </div>
      ) : null}

      {selectedProject && activeTab === 'announcements' ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input value={announcementText} onChange={(event) => setAnnouncementText(event.target.value)} placeholder="Post announcement" className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <button type="button" onClick={handlePostAnnouncement} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Post</button>
          </div>
          <div className="grid gap-3">
            {announcements.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-800">{item.content}</p>
                <p className="mt-1 text-xs text-slate-500">{item.created_at ? new Date(item.created_at).toLocaleString() : 'Now'}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {selectedProject && activeTab === 'chat' ? (
        <div className="space-y-4">
          <div className="max-h-80 space-y-2 overflow-auto rounded-2xl border border-slate-200 bg-white p-4">
            {messages.map((item) => (
              <article key={item.id} className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-700">{item.sender?.full_name || 'Team member'}</p>
                <p className="text-sm text-slate-800">{item.message}</p>
              </article>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={chatText} onChange={(event) => setChatText(event.target.value)} placeholder="Write a message" className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <button type="button" onClick={handleSendMessage} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Send</button>
          </div>
        </div>
      ) : null}

      {selectedProject && activeTab === 'files' ? (
        <div className="space-y-4">
          <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
            <input value={fileName} onChange={(event) => setFileName(event.target.value)} placeholder="File name" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <input value={fileType} onChange={(event) => setFileType(event.target.value)} placeholder="Type (pdf, zip...)" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <input value={fileUrl} onChange={(event) => setFileUrl(event.target.value)} placeholder="Public URL" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <button type="button" onClick={handleAddFile} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Save</button>
          </div>
          <div className="grid gap-3">
            {files.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{item.file_name}</p>
                <p className="text-xs text-slate-500">{item.file_type}</p>
                <a href={item.file_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-cyan-700">Open file</a>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {selectedProject && activeTab === 'meetings' ? (
        <div className="space-y-4">
          <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
            <input value={meetingTitle} onChange={(event) => setMeetingTitle(event.target.value)} placeholder="Meeting title" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <input value={meetingDateTime} onChange={(event) => setMeetingDateTime(event.target.value)} type="datetime-local" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <input value={meetingLocation} onChange={(event) => setMeetingLocation(event.target.value)} placeholder="Location" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            <button type="button" onClick={handleCreateMeeting} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Schedule</button>
          </div>
          <div className="grid gap-3">
            {meetings.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-600">{item.scheduled_for ? new Date(item.scheduled_for).toLocaleString() : ''}</p>
                <p className="text-xs text-slate-500">{item.location || 'No location'}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {selectedProject && activeTab === 'reports' ? (
        <div className="space-y-4">
          <button type="button" onClick={handleGenerateReport} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Generate report</button>
          <div className="grid gap-3">
            {reports.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Report #{item.id}</p>
                <p className="text-xs text-slate-500">{item.created_at ? new Date(item.created_at).toLocaleString() : ''}</p>
                <pre className="mt-2 max-h-56 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(item.report_payload, null, 2)}</pre>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default CollaborationPage
