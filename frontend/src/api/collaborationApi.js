import axiosClient from './axiosClient'

const collaborationBase = '/api/collaboration'

function unwrapResponse(response, key, fallback) {
  const value = response?.data?.[key]
  return value ?? fallback
}

export async function listTeamMembers(projectId) {
  const response = await axiosClient.get(`${collaborationBase}/projects/${projectId}/team`)
  return unwrapResponse(response, 'team_members', [])
}

export async function addTeamMember(projectId, payload) {
  const response = await axiosClient.post(`${collaborationBase}/projects/${projectId}/team`, payload)
  return unwrapResponse(response, 'team_member', null)
}

export async function updateTeamMember(projectId, userId, payload) {
  const response = await axiosClient.patch(`${collaborationBase}/projects/${projectId}/team/${userId}`, payload)
  return unwrapResponse(response, 'team_member', null)
}

export async function removeTeamMember(projectId, userId) {
  return axiosClient.delete(`${collaborationBase}/projects/${projectId}/team/${userId}`)
}

export async function listTasks(projectId) {
  const response = await axiosClient.get(`${collaborationBase}/projects/${projectId}/tasks`)
  return unwrapResponse(response, 'tasks', [])
}

export async function createTask(projectId, payload) {
  const response = await axiosClient.post(`${collaborationBase}/projects/${projectId}/tasks`, payload)
  return unwrapResponse(response, 'task', null)
}

export async function updateTask(taskId, payload) {
  const response = await axiosClient.patch(`${collaborationBase}/tasks/${taskId}`, payload)
  return unwrapResponse(response, 'task', null)
}

export async function deleteTask(taskId) {
  return axiosClient.delete(`${collaborationBase}/tasks/${taskId}`)
}

export async function listAnnouncements(projectId) {
  const response = await axiosClient.get(`${collaborationBase}/projects/${projectId}/announcements`)
  return unwrapResponse(response, 'announcements', [])
}

export async function postAnnouncement(projectId, payload) {
  const response = await axiosClient.post(`${collaborationBase}/projects/${projectId}/announcements`, payload)
  return unwrapResponse(response, 'announcement', null)
}

export async function listMessages(projectId) {
  const response = await axiosClient.get(`${collaborationBase}/projects/${projectId}/messages`)
  return unwrapResponse(response, 'messages', [])
}

export async function postMessage(projectId, payload) {
  const response = await axiosClient.post(`${collaborationBase}/projects/${projectId}/messages`, payload)
  return unwrapResponse(response, 'chat_message', null)
}

export async function listFiles(projectId) {
  const response = await axiosClient.get(`${collaborationBase}/projects/${projectId}/files`)
  return unwrapResponse(response, 'files', [])
}

export async function addFileMetadata(projectId, payload) {
  const response = await axiosClient.post(`${collaborationBase}/projects/${projectId}/files`, payload)
  return unwrapResponse(response, 'file', null)
}

export async function listMeetings(projectId) {
  const response = await axiosClient.get(`${collaborationBase}/projects/${projectId}/meetings`)
  return unwrapResponse(response, 'meetings', [])
}

export async function createMeeting(projectId, payload) {
  const response = await axiosClient.post(`${collaborationBase}/projects/${projectId}/meetings`, payload)
  return unwrapResponse(response, 'meeting', null)
}

export async function listNotifications() {
  const response = await axiosClient.get(`${collaborationBase}/notifications`)
  return unwrapResponse(response, 'notifications', [])
}

export async function markNotificationRead(notificationId) {
  const response = await axiosClient.patch(`${collaborationBase}/notifications/${notificationId}/read`)
  return unwrapResponse(response, 'notification', null)
}

export async function getProjectProgress(projectId) {
  const response = await axiosClient.get(`${collaborationBase}/projects/${projectId}/progress`)
  return response?.data || null
}

export async function listSupervisorProjects() {
  const response = await axiosClient.get(`${collaborationBase}/supervisor/projects`)
  return unwrapResponse(response, 'projects', [])
}

export async function reviewProject(projectId, decision) {
  const response = await axiosClient.patch(`${collaborationBase}/supervisor/projects/${projectId}/review`, { decision })
  return response?.data || null
}

export async function generateReport(projectId) {
  const response = await axiosClient.post(`${collaborationBase}/projects/${projectId}/reports`)
  return unwrapResponse(response, 'report', null)
}

export async function listReports(projectId) {
  const response = await axiosClient.get(`${collaborationBase}/projects/${projectId}/reports`)
  return unwrapResponse(response, 'reports', [])
}
