function AlertIcon({ type }) {
  if (type === 'success') {
    return (
      <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M10 18A8 8 0 1 0 10 2a8 8 0 0 0 0 16m3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
      <path fill="currentColor" d="M9.401 3.046a1 1 0 0 1 1.198 0l6.5 4.9A1 1 0 0 1 17.5 8.75V16a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V8.75a1 1 0 0 1 .401-.804zM10 6.5a1 1 0 0 0-1 1v3.25a1 1 0 1 0 2 0V7.5a1 1 0 0 0-1-1m0 7a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5" />
    </svg>
  )
}

function ApplicationsAlert({ type = 'error', message, actionLabel, onAction, isActionDisabled = false }) {
  if (!message) {
    return null
  }

  const styleMap = {
    success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    error: 'border-rose-300 bg-rose-50 text-rose-800',
  }

  return (
    <div className={["flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-medium", styleMap[type] || styleMap.error].join(' ')}>
      <div className="flex items-center gap-2">
        <AlertIcon type={type} />
        <span>{message}</span>
      </div>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          disabled={isActionDisabled}
          className="inline-flex items-center justify-center rounded-lg border border-current/25 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default ApplicationsAlert
