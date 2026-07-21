import { NavLink } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import axiosClient from '../../api/axiosClient'
import {
  LayoutDashboard,
  Folder,
  Inbox,
  Users,
  Bell,
  User,
  BarChart3,
  LogOut,
} from 'lucide-react'

const navigationItems = [
  {
    label: 'Dashboard',
    to: '/app',
    icon: LayoutDashboard,
  },
  {
    label: 'Projects',
    to: '/app/projects',
    icon: Folder,
  },
  {
    label: 'Applications',
    to: '/app/applications',
    icon: Inbox,
  },
  {
    label: 'Collaboration',
    to: '/app/collaboration',
    icon: Users,
  },
  {
    label: 'Notifications',
    to: '/app/notifications',
    icon: Bell,
  },
  {
    label: 'Profile',
    to: '/app/profile',
    icon: User,
  },
  {
    label: 'Supervisor',
    to: '/app/supervisor',
    icon: BarChart3,
  },
]

function DashboardSidebar({ isOpen, onClose }) {
  const [isSupervisor, setIsSupervisor] = useState(false)

  useEffect(() => {
    const loadRole = async () => {
      const token = localStorage.getItem('projectmatch_token')
      if (!token) {
        setIsSupervisor(false)
        return
      }

      try {
        const response = await axiosClient.get('/api/auth/me')
        setIsSupervisor(Boolean(response.data?.user?.is_supervisor))
      } catch {
        setIsSupervisor(false)
      }
    }

    loadRole()
  }, [])

  const visibleNavigationItems = useMemo(
    () => navigationItems.filter((item) => item.to !== '/app/supervisor' || isSupervisor),
    [isSupervisor],
  )

  const linkClassName = ({ isActive }) =>
    [
      'flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-all duration-200',
      isActive
        ? 'bg-emerald-100 text-emerald-900 font-semibold'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    ].join(' ')

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out sm:static sm:top-0 sm:h-auto sm:translate-x-0 sm:transform-none shrink-0`}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
          {/* Logo Section */}
          <div className="mb-6 flex items-center gap-2 border-b border-gray-200 pb-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
              P
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">ProjectMatch</h2>
              <p className="text-xs text-gray-500">Workspace</p>
            </div>
          </div>

          {/* Navigation */}
          <ul className="space-y-1 font-medium flex-1">
            {visibleNavigationItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/app'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-2 border-emerald-600'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`
                    }
                    onClick={onClose}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>

          {/* Footer Tip */}
          <div className="mt-auto border-t border-gray-200 pt-4">
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
              <p className="text-xs font-semibold text-emerald-900">💡 Tip</p>
              <p className="mt-1 text-xs text-emerald-800">Use collaboration features to manage your team effectively.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default DashboardSidebar
