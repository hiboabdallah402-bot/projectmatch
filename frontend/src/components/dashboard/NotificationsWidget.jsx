import { useMemo } from 'react'

function NotificationsWidget({ isLoading = false }) {
  const notifications = useMemo(() => {
    return [
      {
        id: 1,
        icon: '📥',
        title: 'New application received',
        description: 'Ahmed applied to Smart Attendance System',
        time: '2 hours ago',
        read: false,
      },
      {
        id: 2,
        icon: '✅',
        title: 'Profile updated successfully',
        description: 'Your profile changes have been saved',
        time: '1 day ago',
        read: true,
      },
      {
        id: 3,
        icon: '🤝',
        title: 'Team invitation',
        description: 'You were invited to Campus Connect project',
        time: '3 days ago',
        read: true,
      },
      {
        id: 4,
        icon: '💬',
        title: 'Supervisor feedback',
        description: 'New comment on Hospital Management Analytics',
        time: '5 days ago',
        read: true,
      },
    ]
  }, [])

  if (isLoading) {
    return (
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Recent Notifications</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Recent Notifications</h3>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="space-y-0 divide-y divide-gray-200">
          {notifications.slice(0, 4).map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-emerald-50' : ''
              }`}
            >
              <span className="text-lg flex-shrink-0">{notification.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-xs text-gray-500 truncate">{notification.description}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                {notification.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NotificationsWidget
