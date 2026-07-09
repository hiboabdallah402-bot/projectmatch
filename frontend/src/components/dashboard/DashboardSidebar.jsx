import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const navigationItems = [
  {
    label: 'Overview',
    to: '/app',
    description: 'Your dashboard home',
  },
  {
    label: 'Projects',
    to: '/app/projects',
    description: 'Browse all projects',
  },
  {
    label: 'Create Project',
    to: '/app/projects/create',
    description: 'Publish a new project',
  },
  {
    label: 'Applications',
    to: '/app/applications',
    description: 'View project applications',
  },
  {
    label: 'Profile',
    to: '/app/profile',
    description: 'View and edit your profile',
  },
]

function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const linkClassName = ({ isActive }) =>
    [
      'flex items-start gap-3 rounded-2xl px-4 py-3 transition-colors',
      isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    ].join(' ')

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Dashboard</p>
          <p className="text-sm font-medium text-slate-900">Navigation</p>
        </div>
        <button
          type="button"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <aside className={[isOpen ? 'flex' : 'hidden', 'flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex lg:w-80'].join(' ')}>
        <div className="border-b border-slate-200 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Workspace</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">ProjectMatch Dashboard</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            A focused workspace for managing projects, applications, and your profile.
          </p>
        </div>

        <nav className="mt-5 flex flex-col gap-2" aria-label="Dashboard navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={linkClassName}
              onClick={closeSidebar}
            >
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-current" />
              <span>
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="mt-1 block text-xs opacity-80">{item.description}</span>
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default DashboardSidebar
