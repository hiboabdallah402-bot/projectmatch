import ApplicationStatusBadge from './ApplicationStatusBadge'

function formatAppliedDate(appliedAt) {
  if (!appliedAt) {
    return 'Unknown date'
  }

  const parsed = new Date(appliedAt)
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown date'
  }

  return parsed.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ApplicationCard({ application, isProcessing = false, isRecentlyUpdated = false, onAccept, onReject }) {
  const applicantName = application?.user?.full_name?.trim()
  const applicantLabel = applicantName || (application?.user_id ? `User #${application.user_id}` : 'Unknown applicant')

  const projectTitle = application?.project?.title?.trim()
  const projectLabel = projectTitle || (application?.project_id ? `Project #${application.project_id}` : 'Unknown project')

  const statusLabel = application?.status || 'Unknown status'
  const submittedLabel = formatAppliedDate(application?.applied_at)
  const isPending = String(application?.status || '').toLowerCase() === 'pending'

  return (
    <article
      className={[
        'space-y-5 rounded-3xl border bg-white p-5 shadow-sm transition-all duration-300 ease-out sm:p-6',
        isRecentlyUpdated ? 'border-cyan-300 ring-2 ring-cyan-100' : 'border-slate-200',
      ].join(' ')}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
              <path fill="currentColor" d="M10 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8m0 10c4.411 0 8 2.015 8 4.5V18H2v-1.5C2 14.015 5.589 12 10 12" />
            </svg>
            Applicant
          </p>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{applicantLabel}</h2>
        </div>

        <ApplicationStatusBadge status={statusLabel} animate={isRecentlyUpdated} />
      </header>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Project</dt>
          <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-900">
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-500" aria-hidden="true">
              <path fill="currentColor" d="M3 4a1 1 0 0 1 1-1h4.5a1 1 0 0 1 .707.293l.5.5A1 1 0 0 0 10.414 4H16a1 1 0 0 1 1 1v2H3zm0 4h14v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
            </svg>
            {projectLabel}
          </dd>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</dt>
          <dd className="mt-1 text-sm font-medium text-slate-900">{statusLabel}</dd>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Submitted</dt>
          <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-900">
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-500" aria-hidden="true">
              <path fill="currentColor" d="M10 3a7 7 0 1 0 7 7 1 1 0 1 0-2 0 5 5 0 1 1-5-5 1 1 0 1 0 0-2" />
              <path fill="currentColor" d="M10 6a1 1 0 0 1 1 1v2.586l1.707 1.707a1 1 0 0 1-1.414 1.414l-2-2A1 1 0 0 1 9 10V7a1 1 0 0 1 1-1" />
            </svg>
            {submittedLabel}
          </dd>
        </div>
      </dl>

      {isPending && (onAccept || onReject) ? (
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={onAccept}
            disabled={isProcessing || !onAccept}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
              <path fill="currentColor" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.01 7.07a1 1 0 0 1-1.422 0L3.29 8.746a1 1 0 0 1 1.42-1.41l4.28 4.313 6.3-6.353a1 1 0 0 1 1.414-.006" />
            </svg>
            {isProcessing ? 'Updating...' : 'Accept'}
          </button>
          <button
            type="button"
            onClick={onReject}
            disabled={isProcessing || !onReject}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
              <path fill="currentColor" d="M5.636 4.222a1 1 0 0 1 1.414 0L10 7.172l2.95-2.95a1 1 0 1 1 1.414 1.414L11.414 8.586l2.95 2.95a1 1 0 0 1-1.414 1.414L10 10l-2.95 2.95a1 1 0 1 1-1.414-1.414l2.95-2.95-2.95-2.95a1 1 0 0 1 0-1.414" />
            </svg>
            {isProcessing ? 'Updating...' : 'Reject'}
          </button>
        </div>
      ) : null}
    </article>
  )
}

export default ApplicationCard
