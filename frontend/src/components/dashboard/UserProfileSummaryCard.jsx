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
    <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Profile summary</p>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              {fullName || 'Name unavailable'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{email || 'Email unavailable'}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Joined</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{joinedDate}</p>
          </div>

          <p className="text-sm leading-7 text-slate-600">
            {errorMessage ||
              'Your profile is synced from authenticated account data and ready for editing in the Profile module.'}
          </p>
        </div>
      )}
    </article>
  )
}

export default UserProfileSummaryCard
