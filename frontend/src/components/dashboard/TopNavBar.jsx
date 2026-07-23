import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'
import { Menu, Search, Bell, LogOut, Settings, User, ChevronDown } from 'lucide-react'
import ProjectMatchLogoMark from '../common/ProjectMatchLogoMark'

function TopNavBar({ onMenuClick }) {
  const [user, setUser] = useState(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('projectmatch_token')
      if (!token) {
        setUser(null)
        return
      }

      try {
        const response = await axiosClient.get('/api/auth/me')
        setUser(response.data?.user)
      } catch {
        setUser(null)
      }
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    try {
      await axiosClient.post('/api/auth/logout')
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/app/projects?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onMenuClick}
            className="sm:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Logo */}
          <div className="hidden sm:flex items-center gap-2">
            <ProjectMatchLogoMark className="h-8 w-8" />
            <span className="text-lg font-bold text-slate-900">ProjectMatch</span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm placeholder-slate-500 transition focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-200 outline-none"
            />
          </div>
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 px-4 py-3">
                  <h3 className="font-semibold text-gray-900">Recent Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="space-y-1 p-2">
                    <div className="rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition">
                      <p className="text-sm font-medium text-gray-900">New project invitation</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                    <div className="rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition">
                      <p className="text-sm font-medium text-gray-900">Team member joined</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
                  <a 
                    href="/app/notifications" 
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
                  >
                    View all notifications →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {user?.full_name
                  ? user.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : 'U'}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="space-y-1 p-2">
                  <a
                    href="/app/profile"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </a>
                  <a
                    href="/app/profile/edit"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </a>
                </div>
                <div className="border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition m-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNavBar
