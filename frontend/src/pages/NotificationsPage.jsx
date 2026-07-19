import { useEffect, useState } from 'react'
import { listNotifications, markNotificationRead } from '../api/collaborationApi'

function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadNotifications = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const data = await listNotifications()
      setNotifications(data)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to load notifications.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId)
      setNotifications((previous) =>
        previous.map((item) => (item.id === notificationId ? { ...item, is_read: true } : item)),
      )
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to mark notification as read.')
    }
  }

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Notifications
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Notification center</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Track updates for applications, team membership, tasks, announcements, and meetings.
        </p>
      </header>

      {errorMessage ? <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div> : null}
      {isLoading ? <p className="text-sm text-slate-600">Loading notifications...</p> : null}

      {!isLoading && notifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">No notifications yet.</div>
      ) : null}

      <div className="grid gap-3">
        {notifications.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-700">{item.message}</p>
                <p className="mt-2 text-xs text-slate-500">{item.created_at ? new Date(item.created_at).toLocaleString() : ''}</p>
              </div>
              {!item.is_read ? (
                <button
                  type="button"
                  onClick={() => handleMarkRead(item.id)}
                  className="rounded-lg border border-cyan-300 px-3 py-1.5 text-xs font-semibold text-cyan-700"
                >
                  Mark read
                </button>
              ) : (
                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Read</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default NotificationsPage
