// Reusable Card component
export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`border-b border-slate-200 px-6 py-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg font-semibold text-slate-900 ${className}`}>{children}</h3>
}

export function CardDescription({ children, className = '' }) {
  return <p className={`mt-1 text-sm text-slate-500 ${className}`}>{children}</p>
}

export function CardContent({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return <div className={`border-t border-slate-200 px-6 py-4 ${className}`}>{children}</div>
}
