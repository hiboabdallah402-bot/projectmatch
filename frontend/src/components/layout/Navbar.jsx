import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  clearAccessToken,
  getAccessToken,
  getAuthChangeEventName,
  getNotificationsChangeEventName,
} from '../../utils/auth'
import axiosClient from '../../api/axiosClient'
import { listNotifications } from '../../api/collaborationApi'
import ProjectMatchLogoMark from '../common/ProjectMatchLogoMark'

const publicNavItems = [
  { label: 'Explore', to: '/' },
  { label: 'About', to: '/about' },
]

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAccessToken()))
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [isSupervisor, setIsSupervisor] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(Boolean(getAccessToken()))

    window.addEventListener('storage', syncAuthState)
    window.addEventListener(getAuthChangeEventName(), syncAuthState)

    return () => {
      window.removeEventListener('storage', syncAuthState)
      window.removeEventListener(getAuthChangeEventName(), syncAuthState)
    }
  }, [])

  useEffect(() => {
    const loadUnreadNotifications = async () => {
      if (!isAuthenticated) {
        setUnreadNotifications(0)
        setIsSupervisor(false)
        return
      }

      try {
        const meResponse = await axiosClient.get('/api/auth/me')
        setIsSupervisor(Boolean(meResponse.data?.user?.is_supervisor))

        const notifications = await listNotifications()
        const unreadCount = notifications.filter((notification) => !notification.is_read).length
        setUnreadNotifications(unreadCount)
      } catch {
        setUnreadNotifications(0)
        setIsSupervisor(false)
      }
    }

    loadUnreadNotifications()

    window.addEventListener(getNotificationsChangeEventName(), loadUnreadNotifications)

    return () => {
      window.removeEventListener(getNotificationsChangeEventName(), loadUnreadNotifications)
    }
  }, [isAuthenticated, location.pathname])

  const handleLogout = () => {
    clearAccessToken()
    closeMenu()
    navigate('/login')
  }

  const navLinkClassName = ({ isActive }) =>
    [
      'rounded-full px-4 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-slate-300 hover:bg-indigo-500/10 hover:text-slate-100',
    ].join(' ')

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-hidden border-b border-slate-700/50 bg-slate-950 backdrop-blur-xl shadow-lg shadow-black/10">
      <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex min-w-0 items-center gap-2" onClick={closeMenu}>
          <ProjectMatchLogoMark className="h-10 w-10 shrink-0 shadow-[0_12px_30px_rgba(15,118,110,0.18)]" />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-base font-semibold tracking-tight text-white sm:text-lg">ProjectMatch</span>
            <span className="truncate text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">Find collaborators</span>
          </span>
        </Link>

        <button
          type="button"
          className="inline-flex rounded-xl border border-slate-700 bg-slate-900/50 p-2 text-slate-300 hover:bg-slate-800 sm:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle main navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <nav className="hidden items-center gap-2 sm:flex" aria-label="Main navigation">
          {publicNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClassName} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <NavLink to="/app" className={navLinkClassName}>
                Workspace
              </NavLink>
              <NavLink to="/app/collaboration" className={navLinkClassName}>
                Collaboration
              </NavLink>
              <Link
                to="/app/notifications"
                className="relative rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100"
              >
                Notifications
                {unreadNotifications > 0 ? (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </span>
                ) : null}
              </Link>
              <NavLink to="/app/profile" className={navLinkClassName}>
                Profile
              </NavLink>
              {isSupervisor ? (
                <NavLink to="/app/supervisor" className={navLinkClassName}>
                  Supervisor
                </NavLink>
              ) : null}
              <button
                type="button"
                className="rounded-full border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClassName}>
                Login
              </NavLink>
              <Link
                to="/register"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {isMenuOpen && (
        <nav id="mobile-nav" className="border-t border-slate-700/50 bg-slate-900 px-4 py-3 sm:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-2">
            {publicNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navLinkClassName}
                end={item.to === '/'}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink to="/app" className={navLinkClassName} onClick={closeMenu}>
                  Workspace
                </NavLink>
                <NavLink to="/app/collaboration" className={navLinkClassName} onClick={closeMenu}>
                  Collaboration
                </NavLink>
                <NavLink to="/app/notifications" className={navLinkClassName} onClick={closeMenu}>
                  Notifications {unreadNotifications > 0 ? `(${unreadNotifications})` : ''}
                </NavLink>
                <NavLink to="/app/profile" className={navLinkClassName} onClick={closeMenu}>
                  Profile
                </NavLink>
                {isSupervisor ? (
                  <NavLink to="/app/supervisor" className={navLinkClassName} onClick={closeMenu}>
                    Supervisor
                  </NavLink>
                ) : null}
                <button
                  type="button"
                  className="rounded-full border border-slate-700 bg-slate-900/50 px-4 py-2 text-left text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClassName} onClick={closeMenu}>
                  Login
                </NavLink>
                <Link
                  to="/register"
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-zinc-100"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
