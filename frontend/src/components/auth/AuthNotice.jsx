function AuthNotice({ type = 'info', message }) {
  if (!message) {
    return null
  }

  const styles =
    type === 'success'
      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
      : type === 'error'
        ? 'border-rose-300 bg-rose-50 text-rose-700'
        : 'border-slate-300 bg-slate-50 text-slate-700'

  return <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{message}</div>
}

export default AuthNotice
