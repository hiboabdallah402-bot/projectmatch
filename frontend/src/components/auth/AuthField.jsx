import { useState } from 'react'

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
  const isPasswordField = type === 'password'
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const inputType = isPasswordField && isPasswordVisible ? 'text' : type

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={[
            'w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4',
            isPasswordField ? 'pr-12' : '',
            hasError
              ? 'border-rose-300 bg-rose-50/40 focus:border-rose-400 focus:ring-rose-100'
              : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-100',
          ].join(' ')}
        />

        {isPasswordField ? (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((previous) => !previous)}
            className="absolute inset-y-0 right-3 inline-flex items-center justify-center text-slate-500 transition hover:text-slate-700"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            title={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l3.02 3.02A12.86 12.86 0 0 0 1.9 11.4a1.4 1.4 0 0 0 0 1.2C3.78 15.87 7.63 19 12 19c1.83 0 3.58-.55 5.12-1.52l3.35 3.35a.75.75 0 1 0 1.06-1.06zm10.22 10.22a2.5 2.5 0 0 1-3.44-3.44zm-4.51-4.51 3.58 3.58a2.5 2.5 0 0 0-3.58-3.58M12 5c4.37 0 8.22 3.13 10.1 6.4.2.35.2.85 0 1.2a12.6 12.6 0 0 1-2.57 3.1l-1.08-1.08a11.5 11.5 0 0 0 2.22-2.62C18.98 9.08 15.62 6.5 12 6.5c-1.32 0-2.6.35-3.75.98L7.13 6.36A9.4 9.4 0 0 1 12 5"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 5c4.37 0 8.22 3.13 10.1 6.4.2.35.2.85 0 1.2C20.22 15.87 16.37 19 12 19S3.78 15.87 1.9 12.6a1.4 1.4 0 0 1 0-1.2C3.78 8.13 7.63 5 12 5m0 1.5c-3.62 0-6.98 2.58-8.67 5.5 1.69 2.92 5.05 5.5 8.67 5.5s6.98-2.58 8.67-5.5C18.98 9.08 15.62 6.5 12 6.5m0 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7m0 1.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4"
                />
              </svg>
            )}
          </button>
        ) : null}
      </div>
      {hasError ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  )
}

export default AuthField
