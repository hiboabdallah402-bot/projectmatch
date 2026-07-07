import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'

const publicNavItems = [
  { label: 'Explore', to: '/' },
  { label: 'About', to: '/about' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  const navLinkClassName = ({ isActive }) =>
    [
      'rounded-full px-4 py-2 text-sm font-medium transition-colors',
      isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    ].join(' ')

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2" onClick={closeMenu}>
          <span className="grid h-9 w-9 place-content-center rounded-xl bg-slate-900 text-sm font-bold text-white">
            PM
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">ProjectMatch</span>
        </Link>

        <button
          type="button"
          className="inline-flex rounded-lg border border-slate-300 p-2 text-slate-700 sm:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
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
        </nav>
      </div>

      {isMenuOpen && (
        <nav id="mobile-nav" className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden" aria-label="Mobile navigation">
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
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
