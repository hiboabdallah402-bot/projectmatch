import axiosClient from './axiosClient'

const notificationsBase = '/api/notifications'

function unwrapResponse(response, key, fallback) {
  const value = response?.data?.[key]
  return value ?? fallback
}

/**
 * Get all notifications for the current user
 */
export async function listNotifications() {
  const response = await axiosClient.get(notificationsBase)
  return unwrapResponse(response, 'notifications', [])
}

/**
 * Get notification statistics (total, unread, read_today, high_priority)
 */
export async function getNotificationStats() {
  const response = await axiosClient.get(`${notificationsBase}/stats`)
  return response?.data || {}
}

/**
 * Mark a single notification as read
 */
export async function markNotificationRead(notificationId) {
  const response = await axiosClient.patch(`${notificationsBase}/${notificationId}/read`)
  return unwrapResponse(response, 'notification', null)
}

/**
 * Mark all notifications as read for the current user
 */
export async function markAllNotificationsRead() {
  const response = await axiosClient.patch(`${notificationsBase}/read-all`)
  return response?.data || {}
}

/**
 * Delete a single notification
 */
export async function deleteNotification(notificationId) {
  const response = await axiosClient.delete(`${notificationsBase}/${notificationId}`)
  return response?.data || {}
}
