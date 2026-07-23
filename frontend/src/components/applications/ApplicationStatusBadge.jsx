const STATUS_STYLES = {
  pending: {
    label: 'Pending',
    className: 'border-amber-300 bg-amber-50 text-amber-800',
  },
  accepted: {
    label: 'Accepted',
    className: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  },
  rejected: {
    label: 'Rejected',
    className: 'border-red-300 bg-red-50 text-red-800',
  },
}

function StatusIcon({ statusKey }) {
  if (statusKey === 'accepted') {
    return (
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
        <path fill="currentColor" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.01 7.07a1 1 0 0 1-1.422 0L3.29 8.746a1 1 0 0 1 1.42-1.41l4.28 4.313 6.3-6.353a1 1 0 0 1 1.414-.006" />
      </svg>
    )
  }

  if (statusKey === 'rejected') {
    return (
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
        <path fill="currentColor" d="M5.636 4.222a1 1 0 0 1 1.414 0L10 7.172l2.95-2.95a1 1 0 1 1 1.414 1.414L11.414 8.586l2.95 2.95a1 1 0 0 1-1.414 1.414L10 10l-2.95 2.95a1 1 0 1 1-1.414-1.414l2.95-2.95-2.95-2.95a1 1 0 0 1 0-1.414" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
      <path fill="currentColor" d="M10 3a7 7 0 1 0 7 7 1 1 0 1 0-2 0 5 5 0 1 1-5-5 1 1 0 1 0 0-2" />
      <path fill="currentColor" d="M10 6a1 1 0 0 1 1 1v2.586l1.707 1.707a1 1 0 0 1-1.414 1.414l-2-2A1 1 0 0 1 9 10V7a1 1 0 0 1 1-1" />
    </svg>
  )
}

function ApplicationStatusBadge({ status, animate = false }) {
  const statusKey = String(status || '').trim().toLowerCase()
  const statusMeta = STATUS_STYLES[statusKey] || {
    label: status || 'Unknown',
    className: 'border-slate-300 bg-slate-100 text-slate-700',
  }

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]',
        statusMeta.className,
        animate ? 'ring-2 ring-cyan-200 transition-all duration-500 ease-out' : '',
      ].join(' ')}
    >
      <StatusIcon statusKey={statusKey} />
      {statusMeta.label}
    </span>
  )
}

export default ApplicationStatusBadge
