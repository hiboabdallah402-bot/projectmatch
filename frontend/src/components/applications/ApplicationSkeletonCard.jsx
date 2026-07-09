function ApplicationSkeletonCard() {
  return (
    <article className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-hidden="true">
      <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
      <div className="h-7 w-2/3 animate-pulse rounded bg-slate-100" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
        <div className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
        <div className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-50 sm:col-span-2" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </article>
  )
}

export default ApplicationSkeletonCard
