function resolveInitials(fullName, email) {
  const nameParts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
  }

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase()
  }

  const fallback = String(email || '').trim()
  return fallback ? fallback.slice(0, 2).toUpperCase() : 'PM'
}

function ProfileAvatar({ fullName, email, sizeClassName = 'h-16 w-16 text-xl' }) {
  const initials = resolveInitials(fullName, email)

  return (
    <div
      className={[
        'inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 font-semibold text-cyan-700',
        sizeClassName,
      ].join(' ')}
      aria-label={`Profile avatar for ${fullName || email || 'user'}`}
    >
      {initials}
    </div>
  )
}

export default ProfileAvatar
