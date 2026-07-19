function ApplicationEmptyState({ title = 'No applications yet', description }) {
  const bodyText =
    description ||
    'Your projects have not received applications yet. Share your project links with collaborators to start receiving applicants.'

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 14.172 4H6zm1 3h6v3a1 1 0 0 0 1 1h3v7H7V7zm8 0.414L16.586 9H15V7.414z"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
        {bodyText}
      </p>
    </div>
  )
}

export default ApplicationEmptyState
