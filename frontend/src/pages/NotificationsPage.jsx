import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { listNotifications, getNotificationStats, markNotificationRead, markAllNotificationsRead } from '../api/notificationsApi'
import { dispatchNotificationsChangeEvent, getNotificationsChangeEventName } from '../utils/auth'

function formatDateTime(value) {
  if (!value) {
    return 'Unavailable'
  }

  const date = new Date(value)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

function getNotificationIcon(title) {
  const lower = String(title).toLowerCase()
  if (lower.includes('application') || lower.includes('applied')) return '📥'
  if (lower.includes('accepted') || lower.includes('approved')) return '✅'
  if (lower.includes('team') || lower.includes('joined')) return '🤝'
  if (lower.includes('meeting') || lower.includes('scheduled')) return '📅'
  if (lower.includes('task') || lower.includes('assigned')) return '📋'
  if (lower.includes('deadline') || lower.includes('reminder')) return '⏰'
  if (lower.includes('project')) return '🎯'
  if (lower.includes('message') || lower.includes('comment')) return '💬'
  if (lower.includes('profile')) return '👤'
  return '🔔'
}

function NotificationSkeletonLoader() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 animate-pulse">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 w-2/3 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-full rounded bg-gray-200" />
              <div className="mt-2 h-3 w-1/3 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function NotificationCard({ notification, onMarkRead, isPreview = false }) {
  const icon = getNotificationIcon(notification.title)
  
  return (
    <div className={`rounded-lg border transition-all hover:shadow-md ${
      isPreview ? 'opacity-85' : ''
    } ${
      notification.is_read
        ? 'border-gray-200 bg-white'
        : 'border-emerald-200 bg-emerald-50'
    }`}>
      <div className="flex gap-3 p-4">
        <div className="flex-shrink-0 text-2xl">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-gray-900">{notification.title}</h4>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold flex-shrink-0 ${
              notification.is_read
                ? 'bg-gray-100 text-gray-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              {notification.is_read ? 'Read' : 'New'}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
          <p className="mt-2 text-xs text-gray-500">{formatDateTime(notification.created_at)}</p>
        </div>
      </div>
      {!notification.is_read && !isPreview && (
        <div className="border-t border-emerald-200 bg-emerald-50 px-4 py-3 flex justify-between">
          <button
            onClick={() => onMarkRead(notification.id)}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition"
          >
            Mark as read
          </button>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    gray: 'bg-gray-50 text-gray-700',
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-lg p-3 text-2xl ${colorClasses[color] || colorClasses.gray}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read_today: 0,
    high_priority: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [lastSyncedAt, setLastSyncedAt] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const loadData = async (options = {}) => {
    if (options.background) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setErrorMessage('')

    try {
      const [notificationsData, statsData] = await Promise.all([
        listNotifications(),
        getNotificationStats(),
      ])
      setNotifications(notificationsData || [])
      setStats(statsData || {
        total: 0,
        unread: 0,
        read_today: 0,
        high_priority: 0,
      })
      setLastSyncedAt(new Date())
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to load notifications.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()

    const refreshOnEvent = () => loadData({ background: true })
    window.addEventListener(getNotificationsChangeEventName(), refreshOnEvent)

    return () => {
      window.removeEventListener(getNotificationsChangeEventName(), refreshOnEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadData({ background: true })
    }, 60000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Apply filter
      if (activeFilter === 'unread' && item.is_read) return false
      if (activeFilter === 'read' && !item.is_read) return false

      // Apply search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return (
          String(item.title).toLowerCase().includes(query) ||
          String(item.message).toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [notifications, activeFilter, searchQuery])

  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId)
      setNotifications((previous) =>
        previous.map((item) => (item.id === notificationId ? { ...item, is_read: true } : item)),
      )
      // Refresh stats after marking read
      await loadData({ background: true })
      dispatchNotificationsChangeEvent()
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to mark notification as read.')
    }
  }

  const handleMarkAllRead = async () => {
    if (stats.unread === 0 || isMarkingAllRead) {
      return
    }

    setIsMarkingAllRead(true)
    setErrorMessage('')

    try {
      await markAllNotificationsRead()
      setNotifications((previous) => previous.map((item) => ({ ...item, is_read: true })))
      await loadData({ background: true })
      dispatchNotificationsChangeEvent()
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to mark all notifications as read.')
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600">Stay updated on applications, team activities, and project changes</p>
      </header>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">{errorMessage}</p>
            <button
              onClick={() => loadData({ background: true })}
              className="mt-2 text-sm font-semibold text-red-700 hover:text-red-800"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {!isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total" value={stats.total} icon="📬" color="blue" />
          <StatCard label="Unread" value={stats.unread} icon="🆕" color="emerald" />
          <StatCard label="Read Today" value={stats.read_today} icon="✅" color="amber" />
          <StatCard label="High Priority" value={stats.high_priority} icon="🔥" color="gray" />
        </div>
      )}

      {/* Controls & Search */}
      {!isLoading && (
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
            />
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {['all', 'unread', 'read'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeFilter === filter
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => loadData({ background: true })}
                disabled={isRefreshing}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
              >
                {isRefreshing ? '⟳ Refreshing...' : '⟳ Refresh'}
              </button>
              {stats.unread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={isMarkingAllRead}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  {isMarkingAllRead ? 'Marking...' : 'Mark all read'}
                </button>
              )}
            </div>
          </div>

          {lastSyncedAt && (
            <p className="text-xs text-gray-500">
              Last synced: {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && <NotificationSkeletonLoader />}

      {/* Empty State */}
      {!isLoading && stats.total === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 text-6xl">🔔</div>
          <h3 className="text-lg font-semibold text-gray-900">No notifications yet</h3>
          <p className="mt-2 text-gray-600">
            Notifications will appear here automatically when you receive applications, team members join your projects, or important project updates occur.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link
              to="/app/projects"
              className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition shadow-md"
            >
              Browse Projects
            </Link>
            <Link
              to="/app/applications"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              View Applications
            </Link>
          </div>
        </div>
      )}

      {/* Real Notifications List */}
      {!isLoading && stats.total > 0 && (
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                isPreview={false}
              />
            ))
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-gray-600">No {activeFilter} notifications found.</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default NotificationsPage
