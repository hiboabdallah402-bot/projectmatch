function UserProfileSummaryCard({ user, isLoading, errorMessage }) {
  const fullName = user?.full_name || ''
  const email = user?.email || ''
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unavailable'

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Profile Summary</p>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              {fullName || 'Name unavailable'}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{email || 'Email unavailable'}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Member Since</p>
            <p className="mt-1 text-sm font-medium text-gray-800">{joinedDate}</p>
          </div>

          <p className="text-sm leading-6 text-gray-600">
            {errorMessage ||
              'Your profile syncs from your account. Edit it to customize how teammates see you.'}
          </p>
        </div>
      )}
    </article>
  )
}

export default UserProfileSummaryCard
