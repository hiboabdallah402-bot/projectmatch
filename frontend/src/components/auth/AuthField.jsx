function AuthField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
}) {
  const hasError = Boolean(error)

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={[
          'w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4',
          hasError
            ? 'border-rose-300 bg-rose-50/40 focus:border-rose-400 focus:ring-rose-100'
            : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-100',
        ].join(' ')}
      />
      {hasError ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  )
}

export default AuthField
