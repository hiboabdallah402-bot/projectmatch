const TOKEN_STORAGE_KEY = 'projectmatch_token'
const AUTH_CHANGE_EVENT = 'projectmatch-auth-change'
const NOTIFICATIONS_CHANGE_EVENT = 'projectmatch-notifications-change'

export function getAccessToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setAccessToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function getAuthChangeEventName() {
  return AUTH_CHANGE_EVENT
}

export function dispatchNotificationsChangeEvent() {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGE_EVENT))
}

export function getNotificationsChangeEventName() {
  return NOTIFICATIONS_CHANGE_EVENT
}
