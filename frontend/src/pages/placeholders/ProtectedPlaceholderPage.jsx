function ProtectedPlaceholderPage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-4">
      <p className="inline-flex w-fit rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
        Phase 4B
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">You are inside the protected area</h1>
      <p className="text-base leading-7 text-slate-600">
        Authentication is now working. Dashboard features will be implemented in the next phase.
      </p>
    </section>
  )
}

export default ProtectedPlaceholderPage
