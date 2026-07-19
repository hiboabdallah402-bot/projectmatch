function ProjectMatchLogoMark({ className = 'h-10 w-10' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="60" height="60" rx="18" fill="url(#projectmatch-logo-bg)" />
      <rect x="2.5" y="2.5" width="59" height="59" rx="17.5" stroke="rgba(255,255,255,0.14)" />
      <path
        d="M20 42.5V21.5C20 20.1193 21.1193 19 22.5 19H30.4C37.9111 19 44 25.0889 44 32.6C44 40.1111 37.9111 46.2 30.4 46.2H22.5C21.1193 46.2 20 45.0807 20 43.7Z"
        fill="rgba(255,255,255,0.12)"
      />
      <path
        d="M23.75 42V23.2C23.75 22.5373 24.2873 22 24.95 22H30.3C36.045 22 40.7 26.655 40.7 32.4C40.7 38.145 36.045 42.8 30.3 42.8H24.55"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="22" r="3.2" fill="#99F6E4" />
      <circle cx="24" cy="42" r="3.2" fill="#67E8F9" />
      <circle cx="40.8" cy="32.4" r="3.2" fill="#34D399" />
      <path d="M24 22L40.8 32.4L24 42" stroke="rgba(255,255,255,0.28)" strokeWidth="1.4" strokeLinecap="round" />
      <defs>
        <linearGradient id="projectmatch-logo-bg" x1="10" y1="8" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F766E" />
          <stop offset="0.5" stopColor="#0F172A" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default ProjectMatchLogoMark