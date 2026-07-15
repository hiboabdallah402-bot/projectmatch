import { Link } from 'react-router-dom'

const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'Explore Projects', to: '/' },
      { label: 'Workspace', to: '/app' },
      { label: 'Applications', to: '/app/applications' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Home', to: '/' },
      { label: 'Register', to: '/register' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Profile', to: '/app/profile' },
      { label: 'Login', to: '/login' },
      { label: 'Contact', to: '/about' },
    ],
  },
]

function Footer() {
  return (
    <footer className="bg-black px-4 pt-20">
      <div className="mx-auto w-full max-w-[1350px] overflow-hidden rounded-tl-3xl rounded-tr-3xl bg-[#131314] px-4 pb-6 pt-8 text-white sm:px-8 md:px-16 lg:px-28 lg:pt-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:gap-12 lg:grid-cols-6">
          <div className="space-y-6 lg:col-span-3">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-sm font-semibold tracking-[0.16em] text-cyan-200">
                PM
              </span>
              <span className="text-lg font-semibold tracking-tight">ProjectMatch</span>
            </Link>

            <p className="max-w-96 text-sm leading-6 text-neutral-300">
              ProjectMatch helps students and project owners collaborate faster with clear project discovery,
              application review, and workspace management.
            </p>

            <div className="flex gap-5 md:gap-6">
              <a href="https://github.com" className="text-white transition-colors hover:text-gray-300" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="https://www.linkedin.com" className="text-white transition-colors hover:text-gray-300" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://www.youtube.com" className="text-white transition-colors hover:text-gray-300" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
              <a href="https://www.instagram.com" className="text-white transition-colors hover:text-gray-300" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 items-start gap-8 md:grid-cols-3 md:gap-12 lg:col-span-3 lg:gap-20">
            {footerSections.map((section) => (
              <div key={section.title} className={section.title === 'Company' ? 'col-span-2 md:col-span-1' : ''}>
                <h3 className="mb-4 text-sm font-medium">{section.title}</h3>
                <ul className="space-y-3 text-sm text-neutral-300">
                  {section.links.map((linkItem) => (
                    <li key={linkItem.label}>
                      <Link to={linkItem.to} className="transition-colors hover:text-neutral-100">
                        {linkItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl items-center justify-between border-t border-neutral-700 pt-4">
          <p className="text-sm text-neutral-400">© 2026 ProjectMatch</p>
          <p className="text-sm text-neutral-400">All rights reserved.</p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-full max-h-64 w-full max-w-3xl rounded-full bg-cyan-500/40 blur-[170px]" />
          <h3 className="text-center text-[clamp(2.5rem,13vw,15rem)] font-extrabold leading-[0.78] tracking-[-0.03em] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_#115e59]">
            ProjectMatch
          </h3>
        </div>
      </div>
    </footer>
  )
}

export default Footer
