function LoadingSpinner({ label = 'Loading', size = 'md', className = '' }) {
  const sizeClass =
    size === 'sm'
      ? 'h-4 w-4 border-2'
      : size === 'lg'
        ? 'h-8 w-8 border-[3px]'
        : 'h-6 w-6 border-2'

  return (
    <span className={['inline-flex items-center gap-2 text-sm font-medium text-slate-600', className].join(' ')} role="status" aria-live="polite">
      <span
        className={[
          'inline-block animate-spin rounded-full border-cyan-600 border-t-transparent border-r-transparent',
          sizeClass,
        ].join(' ')}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  )
}

export default LoadingSpinner
